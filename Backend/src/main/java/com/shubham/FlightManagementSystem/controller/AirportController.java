package com.shubham.FlightManagementSystem.controller;

import com.shubham.FlightManagementSystem.entity.Airport;
import com.shubham.FlightManagementSystem.service.AirportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "http://localhost:4200")
public class AirportController {
    
    @Autowired
    private AirportService airportService;
    
    @GetMapping
    public ResponseEntity<List<Airport>> getAllAirports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Airport> getAirportById(@PathVariable Long id) {
        Optional<Airport> airport = airportService.getAirportById(id);
        return airport.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Airport> getAirportByCode(@PathVariable String code) {
        Optional<Airport> airport = airportService.getAirportByCode(code);
        return airport.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Airport>> getAirportsByCity(@PathVariable String city) {
        List<Airport> airports = airportService.getAirportsByCity(city);
        return ResponseEntity.ok(airports);
    }
    
    @GetMapping("/country/{country}")
    public ResponseEntity<List<Airport>> getAirportsByCountry(@PathVariable String country) {
        List<Airport> airports = airportService.getAirportsByCountry(country);
        return ResponseEntity.ok(airports);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Airport>> searchAirports(@RequestParam String keyword) {
        List<Airport> airports = airportService.searchAirports(keyword);
        return ResponseEntity.ok(airports);
    }
    
    @PostMapping
    public ResponseEntity<Airport> createAirport(@Valid @RequestBody Airport airport) {
        if (airportService.airportExists(airport.getCode())) {
            return ResponseEntity.badRequest().build();
        }
        Airport savedAirport = airportService.saveAirport(airport);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAirport);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @Valid @RequestBody Airport airport) {
        try {
            Airport updatedAirport = airportService.updateAirport(id, airport);
            return ResponseEntity.ok(updatedAirport);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
        return ResponseEntity.noContent().build();
    }
}
