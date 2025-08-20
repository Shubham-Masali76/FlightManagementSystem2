package com.shubham.FlightManagementSystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "flights")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Flight number is required")
    @Column(unique = true, nullable = false)
    private String flightNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_id", nullable = false)
    @NotNull(message = "Departure airport is required")
    private Airport departureAirport;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_id", nullable = false)
    @NotNull(message = "Arrival airport is required")
    private Airport arrivalAirport;
    
    @NotNull(message = "Departure time is required")
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @NotNull(message = "Arrival time is required")
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    @NotBlank(message = "Aircraft type is required")
    @Column(nullable = false)
    private String aircraftType;
    
    @Positive(message = "Total seats must be positive")
    @Column(nullable = false)
    private Integer totalSeats;
    
    @Positive(message = "Available seats must be positive")
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightStatus status = FlightStatus.SCHEDULED;
    
    // Default constructor
    public Flight() {}
    
    // Constructor with parameters
    public Flight(String flightNumber, Airport departureAirport, Airport arrivalAirport,
                  LocalDateTime departureTime, LocalDateTime arrivalTime, String aircraftType,
                  Integer totalSeats, BigDecimal price) {
        this.flightNumber = flightNumber;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.aircraftType = aircraftType;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFlightNumber() {
        return flightNumber;
    }
    
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
    
    public Airport getDepartureAirport() {
        return departureAirport;
    }
    
    public void setDepartureAirport(Airport departureAirport) {
        this.departureAirport = departureAirport;
    }
    
    public Airport getArrivalAirport() {
        return arrivalAirport;
    }
    
    public void setArrivalAirport(Airport arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }
    
    public LocalDateTime getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }
    
    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public String getAircraftType() {
        return aircraftType;
    }
    
    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }
    
    public Integer getTotalSeats() {
        return totalSeats;
    }
    
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }
    
    public Integer getAvailableSeats() {
        return availableSeats;
    }
    
    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public FlightStatus getStatus() {
        return status;
    }
    
    public void setStatus(FlightStatus status) {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return "Flight{" +
                "id=" + id +
                ", flightNumber='" + flightNumber + '\'' +
                ", departureAirport=" + departureAirport.getCode() +
                ", arrivalAirport=" + arrivalAirport.getCode() +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", aircraftType='" + aircraftType + '\'' +
                ", totalSeats=" + totalSeats +
                ", availableSeats=" + availableSeats +
                ", price=" + price +
                ", status=" + status +
                '}';
    }
    
    // Enum for flight status
    public enum FlightStatus {
        SCHEDULED, DELAYED, CANCELLED, BOARDING, DEPARTED, ARRIVED
    }
}
