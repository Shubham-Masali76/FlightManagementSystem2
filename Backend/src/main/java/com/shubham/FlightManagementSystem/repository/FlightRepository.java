package com.shubham.FlightManagementSystem.repository;

import com.shubham.FlightManagementSystem.entity.Flight;
import com.shubham.FlightManagementSystem.entity.Flight.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    Optional<Flight> findByFlightNumber(String flightNumber);
    
    List<Flight> findByDepartureAirportCode(String departureAirportCode);
    
    List<Flight> findByArrivalAirportCode(String arrivalAirportCode);
    
    List<Flight> findByDepartureAirportCodeAndArrivalAirportCode(String departureAirportCode, String arrivalAirportCode);
    
    List<Flight> findByDepartureTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Flight> findByStatus(FlightStatus status);
    
    @Query("SELECT f FROM Flight f WHERE f.departureAirport.code = :departureCode " +
           "AND f.arrivalAirport.code = :arrivalCode " +
           "AND f.departureTime >= :departureDate " +
           "AND f.availableSeats >= :seats " +
           "ORDER BY f.departureTime")
    List<Flight> searchFlights(@Param("departureCode") String departureCode,
                              @Param("arrivalCode") String arrivalCode,
                              @Param("departureDate") LocalDateTime departureDate,
                              @Param("seats") Integer seats);
    
    @Query("SELECT f FROM Flight f WHERE f.availableSeats > 0 AND f.status = 'SCHEDULED' " +
           "ORDER BY f.departureTime")
    List<Flight> findAvailableFlights();
    
    boolean existsByFlightNumber(String flightNumber);
}
