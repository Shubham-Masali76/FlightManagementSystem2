package com.shubham.FlightManagementSystem.service;

import com.shubham.FlightManagementSystem.entity.Booking;
import com.shubham.FlightManagementSystem.entity.Booking.BookingStatus;
//import com.shubham.FlightManagementSystem.entity.Flight;
import com.shubham.FlightManagementSystem.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private FlightService flightService;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public Optional<Booking> getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference);
    }
    
    public List<Booking> getBookingsByPassengerName(String passengerName) {
        return bookingRepository.findByPassengerName(passengerName);
    }
    
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }
    
    public List<Booking> getBookingsByFlightId(Long flightId) {
        return bookingRepository.findByFlightId(flightId);
    }
    
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    public List<Booking> searchBookings(String keyword) {
        return bookingRepository.searchBookings(keyword);
    }
    
    public List<Booking> getUpcomingBookings() {
        return bookingRepository.findUpcomingBookings(LocalDateTime.now());
    }
    
    public Booking createBooking(Booking booking) {
        // Generate unique booking reference
        String bookingReference = generateBookingReference();
        booking.setBookingReference(bookingReference);
        
        // Calculate total amount
        BigDecimal totalAmount = booking.getFlight().getPrice().multiply(BigDecimal.valueOf(booking.getNumberOfSeats()));
        booking.setTotalAmount(totalAmount);
        
        // Reserve seats on the flight
        if (!flightService.reserveSeats(booking.getFlight().getId(), booking.getNumberOfSeats())) {
            throw new RuntimeException("Not enough seats available on flight: " + booking.getFlight().getFlightNumber());
        }
        
        return bookingRepository.save(booking);
    }
    
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            
            // If number of seats changed, update seat reservation
            if (!booking.getNumberOfSeats().equals(bookingDetails.getNumberOfSeats())) {
                // Release old seats
                flightService.releaseSeats(booking.getFlight().getId(), booking.getNumberOfSeats());
                // Reserve new seats
                if (!flightService.reserveSeats(booking.getFlight().getId(), bookingDetails.getNumberOfSeats())) {
                    throw new RuntimeException("Not enough seats available");
                }
            }
            
            booking.setPassengerName(bookingDetails.getPassengerName());
            booking.setEmail(bookingDetails.getEmail());
            booking.setPhoneNumber(bookingDetails.getPhoneNumber());
            booking.setNumberOfSeats(bookingDetails.getNumberOfSeats());
            booking.setStatus(bookingDetails.getStatus());
            
            // Recalculate total amount
            BigDecimal totalAmount = booking.getFlight().getPrice().multiply(BigDecimal.valueOf(booking.getNumberOfSeats()));
            booking.setTotalAmount(totalAmount);
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }
    
    public void cancelBooking(Long id) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            
            // Release seats back to the flight
            flightService.releaseSeats(booking.getFlight().getId(), booking.getNumberOfSeats());
            
            // Update booking status
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }
    }
    
    public void deleteBooking(Long id) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            
            // Release seats if booking was confirmed
            if (booking.getStatus() == BookingStatus.CONFIRMED) {
                flightService.releaseSeats(booking.getFlight().getId(), booking.getNumberOfSeats());
            }
            
            bookingRepository.deleteById(id);
        }
    }
    
    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public boolean bookingExists(String bookingReference) {
        return bookingRepository.existsByBookingReference(bookingReference);
    }
}
