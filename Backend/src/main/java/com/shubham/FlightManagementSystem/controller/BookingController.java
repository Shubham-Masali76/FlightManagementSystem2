package com.shubham.FlightManagementSystem.controller;

import com.shubham.FlightManagementSystem.entity.Booking;
import com.shubham.FlightManagementSystem.entity.Booking.BookingStatus;
import com.shubham.FlightManagementSystem.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<Booking> getBookingByReference(@PathVariable String bookingReference) {
        Optional<Booking> booking = bookingService.getBookingByReference(bookingReference);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/passenger/{passengerName}")
    public ResponseEntity<List<Booking>> getBookingsByPassengerName(@PathVariable String passengerName) {
        List<Booking> bookings = bookingService.getBookingsByPassengerName(passengerName);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Booking>> getBookingsByEmail(@PathVariable String email) {
        List<Booking> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<Booking>> getBookingsByFlightId(@PathVariable Long flightId) {
        List<Booking> bookings = bookingService.getBookingsByFlightId(flightId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookings() {
        List<Booking> bookings = bookingService.getUpcomingBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Booking>> searchBookings(@RequestParam String keyword) {
        List<Booking> bookings = bookingService.searchBookings(keyword);
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking) {
        try {
            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @Valid @RequestBody Booking booking) {
        try {
            Booking updatedBooking = bookingService.updateBooking(id, booking);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
