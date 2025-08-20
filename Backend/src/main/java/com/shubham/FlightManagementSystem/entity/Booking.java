package com.shubham.FlightManagementSystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "bookings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Booking reference is required")
    @Column(unique = true, nullable = false)
    private String bookingReference;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    @NotNull(message = "Flight is required")
    private Flight flight;
    
    @NotBlank(message = "Passenger name is required")
    @Column(nullable = false)
    private String passengerName;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(nullable = false)
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Column(nullable = false)
    private String phoneNumber;
    
    @Positive(message = "Number of seats must be positive")
    @Column(nullable = false)
    private Integer numberOfSeats;
    
    @Positive(message = "Total amount must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;
    
    @Column(nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    // Default constructor
    public Booking() {}
    
    // Constructor with parameters
    public Booking(String bookingReference, Flight flight, String passengerName, 
                   String email, String phoneNumber, Integer numberOfSeats, BigDecimal totalAmount) {
        this.bookingReference = bookingReference;
        this.flight = flight;
        this.passengerName = passengerName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.numberOfSeats = numberOfSeats;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBookingReference() {
        return bookingReference;
    }
    
    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }
    
    public Flight getFlight() {
        return flight;
    }
    
    public void setFlight(Flight flight) {
        this.flight = flight;
    }
    
    public String getPassengerName() {
        return passengerName;
    }
    
    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }
    
    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getBookingDate() {
        return bookingDate;
    }
    
    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
    
    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", bookingReference='" + bookingReference + '\'' +
                ", flight=" + flight.getFlightNumber() +
                ", passengerName='" + passengerName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", numberOfSeats=" + numberOfSeats +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                ", bookingDate=" + bookingDate +
                '}';
    }
    
    // Enum for booking status
    public enum BookingStatus {
        CONFIRMED, CANCELLED, COMPLETED, PENDING
    }
}
