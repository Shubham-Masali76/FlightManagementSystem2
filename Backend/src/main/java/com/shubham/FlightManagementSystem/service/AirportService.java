package com.shubham.FlightManagementSystem.service;

import com.shubham.FlightManagementSystem.entity.Airport;
import com.shubham.FlightManagementSystem.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AirportService {
    
    @Autowired
    private AirportRepository airportRepository;
    
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }
    
    public Optional<Airport> getAirportById(Long id) {
        return airportRepository.findById(id);
    }
    
    public Optional<Airport> getAirportByCode(String code) {
        return airportRepository.findByCode(code);
    }
    
    public List<Airport> getAirportsByCity(String city) {
        return airportRepository.findByCity(city);
    }
    
    public List<Airport> getAirportsByCountry(String country) {
        return airportRepository.findByCountry(country);
    }
    
    public List<Airport> searchAirports(String keyword) {
        return airportRepository.searchAirports(keyword);
    }
    
    public Airport saveAirport(Airport airport) {
        return airportRepository.save(airport);
    }
    
    public Airport updateAirport(Long id, Airport airportDetails) {
        Optional<Airport> optionalAirport = airportRepository.findById(id);
        if (optionalAirport.isPresent()) {
            Airport airport = optionalAirport.get();
            airport.setCode(airportDetails.getCode());
            airport.setName(airportDetails.getName());
            airport.setCity(airportDetails.getCity());
            airport.setCountry(airportDetails.getCountry());
            return airportRepository.save(airport);
        }
        throw new RuntimeException("Airport not found with id: " + id);
    }
    
    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }
    
    public boolean airportExists(String code) {
        return airportRepository.existsByCode(code);
    }
}
