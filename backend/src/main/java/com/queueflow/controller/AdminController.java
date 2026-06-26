package com.queueflow.controller;

import com.queueflow.dto.AppointmentResponse;
import com.queueflow.dto.DashboardStats;
import com.queueflow.dto.UserResponse;
import com.queueflow.entity.User;
import com.queueflow.repository.AppointmentRepository;
import com.queueflow.repository.UserRepository;
import com.queueflow.service.AnalyticsService;
import com.queueflow.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final AppointmentService appointmentService;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(analyticsService.getDashboardStats(industry));
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<List<AppointmentResponse>> getTodayAppointments(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(appointmentService.getTodayAppointments(industry));
    }

    @GetMapping("/analytics/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyBookings(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(analyticsService.getDailyBookings(industry));
    }

    @GetMapping("/analytics/services")
    public ResponseEntity<List<Map<String, Object>>> getServicePopularity(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(analyticsService.getServicePopularity(industry));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
            try {
                User.Role userRole = User.Role.valueOf(role.toUpperCase());
                users = userRepository.findAllByRoleOrderByCreatedAtDesc(userRole);
            } catch (IllegalArgumentException e) {
                users = userRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            users = userRepository.findAllByOrderByCreatedAtDesc();
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        List<UserResponse> responses = users.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole().name())
                        .industry(user.getIndustry())
                        .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : "N/A")
                        .totalAppointments(appointmentRepository.countByUser(user))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}

