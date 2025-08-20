# Flight Management System

A comprehensive flight management system built with Angular frontend and Spring Boot backend, featuring PostgreSQL database and Hibernate JPA.

## Features

### Backend (Spring Boot)

- **RESTful API** with comprehensive endpoints
- **Hibernate JPA** for database operations
- **PostgreSQL** database integration
- **Data validation** and error handling
- **CORS configuration** for frontend integration
- **Sample data loader** for testing

### Frontend (Angular)

- **Modern UI** with Angular Material Design
- **Responsive design** for all devices
- **Real-time search** and filtering
- **Form validation** and error handling
- **Interactive tables** with sorting and actions

### Core Functionality

- **Flight Management**: View, search, and manage flights
- **Booking System**: Create and manage flight bookings
- **Airport Management**: Manage airport information
- **Seat Management**: Automatic seat reservation and release
- **Status Tracking**: Real-time flight and booking status updates

## Technology Stack

### Backend

- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **Hibernate**
- **PostgreSQL**
- **Spring Security**
- **Maven**

### Frontend

- **Angular 17**
- **Angular Material**
- **TypeScript**
- **SCSS**
- **RxJS**

## Prerequisites

Before running this application, make sure you have the following installed:

- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher
- **Angular CLI 17** or higher

## Quick Start

### 1. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create a new database**:
   ```sql
   CREATE DATABASE flight_management_db;
   ```
3. **Update database configuration** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/flight_management_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2. Backend Setup

1. **Navigate to the project root**:

   ```bash
   cd FlightManagementSystem
   ```

2. **Build the project**:

   ```bash
   mvn clean install
   ```

3. **Run the Spring Boot application**:

   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. **Navigate to the Angular project**:

   ```bash
   cd flight-management-ui
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:4200`

## Project Structure

```
FlightManagementSystem/
├── src/main/java/com/shubham/FlightManagementSystem/
│   ├── entity/           # JPA entities
│   │   ├── Airport.java
│   │   ├── Flight.java
│   │   └── Booking.java
│   ├── repository/       # Data access layer
│   │   ├── AirportRepository.java
│   │   ├── FlightRepository.java
│   │   └── BookingRepository.java
│   ├── service/          # Business logic layer
│   │   ├── AirportService.java
│   │   ├── FlightService.java
│   │   └── BookingService.java
│   ├── controller/       # REST controllers
│   │   ├── AirportController.java
│   │   ├── FlightController.java
│   │   └── BookingController.java
│   └── config/           # Configuration classes
│       ├── SecurityConfig.java
│       └── DataLoader.java
├── flight-management-ui/ # Angular frontend
│   ├── src/app/
│   │   ├── components/   # Angular components
│   │   ├── models/       # TypeScript interfaces
│   │   ├── services/     # Angular services
│   │   └── app.component.ts
│   └── package.json
└── pom.xml
```

## API Endpoints

### Airports

- `GET /api/airports` - Get all airports
- `GET /api/airports/{id}` - Get airport by ID
- `GET /api/airports/code/{code}` - Get airport by code
- `POST /api/airports` - Create new airport
- `PUT /api/airports/{id}` - Update airport
- `DELETE /api/airports/{id}` - Delete airport

### Flights

- `GET /api/flights` - Get all flights
- `GET /api/flights/{id}` - Get flight by ID
- `GET /api/flights/search` - Search flights
- `GET /api/flights/available` - Get available flights
- `POST /api/flights` - Create new flight
- `PUT /api/flights/{id}` - Update flight
- `DELETE /api/flights/{id}` - Delete flight

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/reference/{ref}` - Get booking by reference
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `DELETE /api/bookings/{id}` - Delete booking

## Usage Guide

### 1. Access the Application

- Open your browser and navigate to `http://localhost:4200`
- The application will load with a modern, responsive interface

### 2. Navigation

- Use the sidebar navigation to access different sections:
  - **Flights**: View and manage all flights
  - **Search Flights**: Search for available flights
  - **Bookings**: View and manage bookings
  - **New Booking**: Create a new booking
  - **Airports**: Manage airport information

### 3. Flight Management

- View all flights in a comprehensive table
- Search flights by departure/arrival airports and dates
- Book flights directly from the search results
- Monitor flight status and seat availability

### 4. Booking Management

- Create new bookings with passenger information
- View booking history and status
- Cancel bookings when needed
- Track booking references for confirmation

### 5. Airport Management

- View all airports with search functionality
- Manage airport information
- Add, edit, or delete airports as needed

## Configuration

### Database Configuration

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/flight_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration

Update API base URL in Angular services if needed:

```typescript
private apiUrl = 'http://localhost:8080/api/airports';
```

## Testing

### Backend Testing

```bash
mvn test
```

### Frontend Testing

```bash
cd flight-management-ui
ng test
```

## Sample Data

The application includes a `DataLoader` that automatically populates the database with sample data:

- **8 Major Airports** (JFK, LHR, CDG, NRT, SYD, DEL, BOM, BLR)
- **5 Sample Flights** with realistic routes and schedules

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure PostgreSQL is running
   - Verify database credentials in `application.properties`
   - Check if the database exists

2. **CORS Errors**

   - Ensure the backend is running on port 8080
   - Check CORS configuration in `SecurityConfig.java`

3. **Angular Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Update Angular CLI: `npm install -g @angular/cli@latest`

4. **Port Conflicts**
   - Backend: Change port in `application.properties`
   - Frontend: Use `ng serve --port 4201`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 👨‍💻 Author

**Shubham** - Flight Management System

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- Angular Material for the beautiful UI components
- PostgreSQL for the reliable database system

## Images

![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859667_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859668_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859669_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859670_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859671_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859672_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859691_y.jpg)
![My Code Screenshot](https://github.com/ShubhamMasali76/FlightManagementSystem2/blob/8aa2752da9d9fe408cee73d0a8fa19408640ae5e/photo_6136645489114859697_y.jpg)

