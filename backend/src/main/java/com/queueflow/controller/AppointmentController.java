package com.queueflow.controller;

import com.queueflow.dto.AppointmentRequest;
import com.queueflow.dto.AppointmentResponse;
import com.queueflow.entity.Appointment;
import com.queueflow.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.bookAppointment(email, request));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.getUserAppointments(email));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointmentsByStatus(
            Authentication authentication,
            @PathVariable String status) {
        String email = authentication.getName();
        Appointment.Status appointmentStatus = Appointment.Status.valueOf(status.toUpperCase());
        return ResponseEntity.ok(appointmentService.getUserAppointmentsByStatus(email, appointmentStatus));
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            Authentication authentication,
            @NonNull @PathVariable Long id) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, email));
    }
}
