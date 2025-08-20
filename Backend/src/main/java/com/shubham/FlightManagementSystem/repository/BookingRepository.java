package com.shubham.FlightManagementSystem.repository;

import com.shubham.FlightManagementSystem.entity.Booking;
import com.shubham.FlightManagementSystem.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByPassengerName(String passengerName);
    
    List<Booking> findByEmail(String email);
    
    List<Booking> findByFlightId(Long flightId);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByBookingDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.passengerName LIKE %:keyword% " +
           "OR b.email LIKE %:keyword% OR b.bookingReference LIKE %:keyword%")
    List<Booking> searchBookings(@Param("keyword") String keyword);
    
    @Query("SELECT b FROM Booking b WHERE b.flight.departureTime >= :date " +
           "ORDER BY b.flight.departureTime")
    List<Booking> findUpcomingBookings(@Param("date") LocalDateTime date);
    
    boolean existsByBookingReference(String bookingReference);
}
