package com.queueflow.service;

import com.queueflow.dto.AppointmentRequest;
import com.queueflow.dto.AppointmentResponse;
import com.queueflow.entity.Appointment;
import com.queueflow.entity.ServiceEntity;
import com.queueflow.entity.User;
import com.queueflow.repository.AppointmentRepository;
import com.queueflow.repository.ServiceRepository;
import com.queueflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    @Transactional
    @SuppressWarnings("null")
    public AppointmentResponse bookAppointment(String userEmail, AppointmentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long svcId = request.getServiceId();
        ServiceEntity service = serviceRepository.findById(svcId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        LocalDate date = LocalDate.parse(request.getAppointmentDate());
        LocalTime time = LocalTime.parse(request.getAppointmentTime());

        // Generate token number
        String tokenNo = generateTokenNumber();

        Appointment appointment = Appointment.builder()
                .user(user)
                .service(service)
                .appointmentDate(date)
                .appointmentTime(time)
                .tokenNo(tokenNo)
                .status(Appointment.Status.BOOKED)
                .industry(service.getIndustry())
                .build();

        Appointment nonNullAppt = appointment;
        appointmentRepository.save(nonNullAppt);

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getUserAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return appointmentRepository.findByUserOrderByAppointmentDateDescAppointmentTimeDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getUserAppointmentsByStatus(String userEmail, Appointment.Status status) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return appointmentRepository.findByUserAndStatusOrderByAppointmentDateDesc(user, status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getTodayAppointments(String industry) {
        if (industry != null && !industry.isEmpty()) {
            return appointmentRepository.findByAppointmentDateAndIndustryOrderByAppointmentTimeAsc(LocalDate.now(), industry)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return List.of(); // Requires industry context
    }

    @Transactional
    public AppointmentResponse cancelAppointment(@NonNull Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        if (appointment.getStatus() == Appointment.Status.COMPLETED ||
            appointment.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Cannot cancel a " + appointment.getStatus() + " appointment");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    private String generateTokenNumber() {
        Long maxId = appointmentRepository.findMaxId().orElse(1000L);
        return "QF-" + (maxId + 1);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        // Calculate estimated wait time
        int waitMinutes = calculateEstimatedWait(appointment);

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .tokenNo(appointment.getTokenNo())
                .serviceName(appointment.getService().getServiceName())
                .appointmentDate(appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .appointmentTime(appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status(appointment.getStatus().name())
                .userName(appointment.getUser().getName())
                .userEmail(appointment.getUser().getEmail())
                .estimatedWaitMinutes(waitMinutes)
                .build();
    }

    private int calculateEstimatedWait(Appointment appointment) {
        if (appointment.getStatus() != Appointment.Status.BOOKED &&
            appointment.getStatus() != Appointment.Status.WAITING) {
            return 0;
        }

        List<Appointment> waitingBefore = appointmentRepository
                .findByAppointmentDateAndStatusAndIndustryOrderByAppointmentTimeAsc(
                        appointment.getAppointmentDate(), Appointment.Status.WAITING, appointment.getIndustry());

        int totalWait = 0;
        for (Appointment a : waitingBefore) {
            if (a.getId().equals(appointment.getId())) break;
            totalWait += a.getService().getDuration();
        }

        // Add booked ones before this appointment
        List<Appointment> bookedBefore = appointmentRepository
                .findByAppointmentDateAndStatusAndIndustryOrderByAppointmentTimeAsc(
                        appointment.getAppointmentDate(), Appointment.Status.BOOKED, appointment.getIndustry());

        for (Appointment a : bookedBefore) {
            if (a.getAppointmentTime().isBefore(appointment.getAppointmentTime())) {
                totalWait += a.getService().getDuration();
            }
        }

        return totalWait;
    }
}
