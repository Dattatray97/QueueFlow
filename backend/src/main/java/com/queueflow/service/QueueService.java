package com.queueflow.service;

import com.queueflow.dto.AppointmentResponse;
import com.queueflow.dto.QueueStatusResponse;
import com.queueflow.entity.Appointment;
import com.queueflow.entity.User;
import com.queueflow.repository.AppointmentRepository;
import com.queueflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public QueueStatusResponse getQueueStatus(String userEmail, String industry) {
        if (industry == null || industry.isEmpty()) return QueueStatusResponse.builder().currentServingToken("N/A").currentServiceName("N/A").waitingTokens(List.of()).build();
        LocalDate today = LocalDate.now();

        // Get current serving token
        Optional<Appointment> currentServing = appointmentRepository.findCurrentServingToken(today, industry);

        // Get waiting tokens
        List<Appointment> waitingTokens = appointmentRepository.findWaitingTokens(today, industry);

        // Find user's token for today
        User user = userRepository.findByEmail(userEmail).orElse(null);
        String yourToken = null;
        int waitingAhead = 0;
        int estimatedWait = 0;

        if (user != null) {
            for (int i = 0; i < waitingTokens.size(); i++) {
                if (waitingTokens.get(i).getUser().getId().equals(user.getId())) {
                    yourToken = waitingTokens.get(i).getTokenNo();
                    waitingAhead = i;
                    // Calculate estimated wait based on service durations of those ahead
                    for (int j = 0; j < i; j++) {
                        estimatedWait += waitingTokens.get(j).getService().getDuration();
                    }
                    break;
                }
            }
        }

        return QueueStatusResponse.builder()
                .currentServingToken(currentServing.map(Appointment::getTokenNo).orElse("N/A"))
                .currentServiceName(currentServing.map(a -> a.getService().getServiceName()).orElse("N/A"))
                .yourToken(yourToken)
                .waitingAhead(waitingAhead)
                .estimatedWaitMinutes(estimatedWait)
                .waitingTokens(waitingTokens.stream().map(this::mapToResponse).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public AppointmentResponse callNextToken(String industry) {
        if (industry == null || industry.isEmpty()) throw new RuntimeException("Industry context required");
        LocalDate today = LocalDate.now();

        // Complete current serving token if any
        Optional<Appointment> currentServing = appointmentRepository.findCurrentServingToken(today, industry);
        currentServing.ifPresent(appointment -> {
            appointment.setStatus(Appointment.Status.COMPLETED);
            appointmentRepository.save(appointment);
        });

        // Get next waiting token
        Optional<Appointment> nextToken = appointmentRepository.findNextWaitingToken(today, industry);

        if (nextToken.isEmpty()) {
            throw new RuntimeException("No more tokens in the queue");
        }

        Appointment next = nextToken.get();
        next.setStatus(Appointment.Status.IN_PROGRESS);
        appointmentRepository.save(next);

        return mapToResponse(next);
    }

    @Transactional
    public AppointmentResponse skipToken(@NonNull Long appointmentId, String industry) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(Appointment.Status.WAITING);
        appointmentRepository.save(appointment);

        // Call the next token
        return callNextToken(industry);
    }

    @Transactional
    public AppointmentResponse completeToken(@NonNull Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(Appointment.Status.COMPLETED);
        appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancelToken(@NonNull Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getWaitingTokens(String industry) {
        if (industry == null || industry.isEmpty()) return List.of();
        LocalDate today = LocalDate.now();
        return appointmentRepository.findWaitingTokens(today, industry)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getCurrentToken(String industry) {
        if (industry == null || industry.isEmpty()) throw new RuntimeException("Industry context required");
        LocalDate today = LocalDate.now();
        Appointment current = appointmentRepository.findCurrentServingToken(today, industry)
                .orElseThrow(() -> new RuntimeException("No token is currently being served"));
        return mapToResponse(current);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .tokenNo(appointment.getTokenNo())
                .serviceName(appointment.getService().getServiceName())
                .appointmentDate(appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .appointmentTime(appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status(appointment.getStatus().name())
                .userName(appointment.getUser().getName())
                .userEmail(appointment.getUser().getEmail())
                .build();
    }
}
