package com.shubham.FlightManagementSystem.repository;

import com.shubham.FlightManagementSystem.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    
    Optional<Airport> findByCode(String code);
    
    List<Airport> findByCity(String city);
    
    List<Airport> findByCountry(String country);
    
    @Query("SELECT a FROM Airport a WHERE a.city LIKE %:keyword% OR a.name LIKE %:keyword% OR a.code LIKE %:keyword%")
    List<Airport> searchAirports(@Param("keyword") String keyword);
    
    boolean existsByCode(String code);
}
