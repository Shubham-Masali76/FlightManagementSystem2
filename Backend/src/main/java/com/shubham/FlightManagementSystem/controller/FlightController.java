package com.shubham.FlightManagementSystem.controller;

import com.shubham.FlightManagementSystem.entity.Flight;
import com.shubham.FlightManagementSystem.entity.Flight.FlightStatus;
import com.shubham.FlightManagementSystem.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:4200")
public class FlightController {
    
    @Autowired
    private FlightService flightService;
    
    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Optional<Flight> flight = flightService.getFlightById(id);
        return flight.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{flightNumber}")
    public ResponseEntity<Flight> getFlightByNumber(@PathVariable String flightNumber) {
        Optional<Flight> flight = flightService.getFlightByNumber(flightNumber);
        return flight.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/departure/{airportCode}")
    public ResponseEntity<List<Flight>> getFlightsByDepartureAirport(@PathVariable String airportCode) {
        List<Flight> flights = flightService.getFlightsByDepartureAirport(airportCode);
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/arrival/{airportCode}")
    public ResponseEntity<List<Flight>> getFlightsByArrivalAirport(@PathVariable String airportCode) {
        List<Flight> flights = flightService.getFlightsByArrivalAirport(airportCode);
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Flight>> getAvailableFlights() {
        List<Flight> flights = flightService.getAvailableFlights();
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Flight>> getFlightsByStatus(@PathVariable FlightStatus status) {
        List<Flight> flights = flightService.getFlightsByStatus(status);
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String departureCode,
            @RequestParam String arrivalCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate,
            @RequestParam(defaultValue = "1") Integer seats) {
        
        List<Flight> flights = flightService.searchFlights(departureCode, arrivalCode, departureDate, seats);
        return ResponseEntity.ok(flights);
    }
    
    @PostMapping
    public ResponseEntity<Flight> createFlight(@Valid @RequestBody Flight flight) {
        if (flightService.flightExists(flight.getFlightNumber())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Flight savedFlight = flightService.saveFlight(flight);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFlight);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @Valid @RequestBody Flight flight) {
        try {
            Flight updatedFlight = flightService.updateFlight(id, flight);
            return ResponseEntity.ok(updatedFlight);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Flight> updateFlightStatus(@PathVariable Long id, @RequestParam FlightStatus status) {
        Optional<Flight> optionalFlight = flightService.getFlightById(id);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            flight.setStatus(status);
            Flight updatedFlight = flightService.updateFlight(id, flight);
            return ResponseEntity.ok(updatedFlight);
        }
        return ResponseEntity.notFound().build();
    }
}
