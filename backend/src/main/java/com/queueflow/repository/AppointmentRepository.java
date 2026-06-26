package com.queueflow.repository;

import com.queueflow.entity.Appointment;
import com.queueflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // User appointments
    List<Appointment> findByUserOrderByAppointmentDateDescAppointmentTimeDesc(User user);

    List<Appointment> findByUserAndStatusOrderByAppointmentDateDesc(User user, Appointment.Status status);

    // Today's appointments
    List<Appointment> findByAppointmentDateAndIndustryOrderByAppointmentTimeAsc(LocalDate date, String industry);

    List<Appointment> findByAppointmentDateAndStatusAndIndustryOrderByAppointmentTimeAsc(LocalDate date, Appointment.Status status, String industry);

    // Queue management
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.industry = :industry AND a.status = 'IN_PROGRESS' ORDER BY a.updatedAt DESC")
    Optional<Appointment> findCurrentServingToken(@Param("date") LocalDate date, @Param("industry") String industry);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.industry = :industry AND a.status IN ('BOOKED', 'WAITING') ORDER BY a.appointmentTime ASC")
    List<Appointment> findWaitingTokens(@Param("date") LocalDate date, @Param("industry") String industry);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.industry = :industry AND a.status IN ('BOOKED', 'WAITING') ORDER BY a.appointmentTime ASC LIMIT 1")
    Optional<Appointment> findNextWaitingToken(@Param("date") LocalDate date, @Param("industry") String industry);

    // Counts
    long countByAppointmentDateAndIndustry(LocalDate date, String industry);

    long countByAppointmentDateAndStatusAndIndustry(LocalDate date, Appointment.Status status, String industry);

    // Analytics - daily bookings for last 7 days
    @Query("SELECT a.appointmentDate, COUNT(a) FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND a.industry = :industry GROUP BY a.appointmentDate ORDER BY a.appointmentDate")
    List<Object[]> countByDateBetweenAndIndustry(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("industry") String industry);

    // Analytics - service popularity
    @Query("SELECT a.service.serviceName, COUNT(a) FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND a.industry = :industry GROUP BY a.service.serviceName")
    List<Object[]> countByServiceBetweenAndIndustry(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("industry") String industry);

    // Token generation - find max token number
    @Query("SELECT MAX(a.id) FROM Appointment a")
    Optional<Long> findMaxId();

    // Check for duplicate booking
    boolean existsByUserAndAppointmentDateAndStatusNot(User user, LocalDate date, Appointment.Status status);

    // Count user's total appointments
    long countByUser(User user);
}
