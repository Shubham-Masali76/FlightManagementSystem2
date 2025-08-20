package com.shubham.FlightManagementSystem.service;

// import com.shubham.FlightManagementSystem.entity.Airport;
import com.shubham.FlightManagementSystem.entity.Flight;
import com.shubham.FlightManagementSystem.entity.Flight.FlightStatus;
import com.shubham.FlightManagementSystem.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FlightService {
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private AirportService airportService;
    
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }
    
    public Optional<Flight> getFlightByNumber(String flightNumber) {
        return flightRepository.findByFlightNumber(flightNumber);
    }
    
    public List<Flight> getFlightsByDepartureAirport(String airportCode) {
        return flightRepository.findByDepartureAirportCode(airportCode);
    }
    
    public List<Flight> getFlightsByArrivalAirport(String airportCode) {
        return flightRepository.findByArrivalAirportCode(airportCode);
    }
    
    public List<Flight> searchFlights(String departureCode, String arrivalCode, 
                                    LocalDateTime departureDate, Integer seats) {
        return flightRepository.searchFlights(departureCode, arrivalCode, departureDate, seats);
    }
    
    public List<Flight> getAvailableFlights() {
        return flightRepository.findAvailableFlights();
    }
    
    public List<Flight> getFlightsByStatus(FlightStatus status) {
        return flightRepository.findByStatus(status);
    }
    
    public Flight saveFlight(Flight flight) {
        // Validate airports exist
        if (!airportService.airportExists(flight.getDepartureAirport().getCode())) {
            throw new RuntimeException("Departure airport not found: " + flight.getDepartureAirport().getCode());
        }
        if (!airportService.airportExists(flight.getArrivalAirport().getCode())) {
            throw new RuntimeException("Arrival airport not found: " + flight.getArrivalAirport().getCode());
        }
        
        // Set initial available seats to total seats
        flight.setAvailableSeats(flight.getTotalSeats());
        
        return flightRepository.save(flight);
    }
    
    public Flight updateFlight(Long id, Flight flightDetails) {
        Optional<Flight> optionalFlight = flightRepository.findById(id);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            flight.setFlightNumber(flightDetails.getFlightNumber());
            flight.setDepartureAirport(flightDetails.getDepartureAirport());
            flight.setArrivalAirport(flightDetails.getArrivalAirport());
            flight.setDepartureTime(flightDetails.getDepartureTime());
            flight.setArrivalTime(flightDetails.getArrivalTime());
            flight.setAircraftType(flightDetails.getAircraftType());
            flight.setTotalSeats(flightDetails.getTotalSeats());
            flight.setPrice(flightDetails.getPrice());
            flight.setStatus(flightDetails.getStatus());
            return flightRepository.save(flight);
        }
        throw new RuntimeException("Flight not found with id: " + id);
    }
    
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }
    
    public boolean reserveSeats(Long flightId, Integer numberOfSeats) {
        Optional<Flight> optionalFlight = flightRepository.findById(flightId);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            if (flight.getAvailableSeats() >= numberOfSeats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - numberOfSeats);
                flightRepository.save(flight);
                return true;
            }
        }
        return false;
    }
    
    public void releaseSeats(Long flightId, Integer numberOfSeats) {
        Optional<Flight> optionalFlight = flightRepository.findById(flightId);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            int newAvailableSeats = flight.getAvailableSeats() + numberOfSeats;
            if (newAvailableSeats <= flight.getTotalSeats()) {
                flight.setAvailableSeats(newAvailableSeats);
                flightRepository.save(flight);
            }
        }
    }
    
    public boolean flightExists(String flightNumber) {
        return flightRepository.existsByFlightNumber(flightNumber);
    }
}
