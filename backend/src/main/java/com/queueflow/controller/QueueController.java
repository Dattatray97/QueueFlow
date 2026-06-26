package com.queueflow.controller;

import com.queueflow.dto.AppointmentResponse;
import com.queueflow.dto.QueueStatusResponse;
import com.queueflow.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @GetMapping("/status")
    public ResponseEntity<QueueStatusResponse> getQueueStatus(Authentication authentication, @RequestParam(required = false) String industry) {
        String email = authentication.getName();
        return ResponseEntity.ok(queueService.getQueueStatus(email, industry));
    }

    @GetMapping("/current")
    public ResponseEntity<AppointmentResponse> getCurrentToken(@RequestParam(required = false) String industry) {
        try {
            return ResponseEntity.ok(queueService.getCurrentToken(industry));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(null);
        }
    }

    @GetMapping("/waiting")
    public ResponseEntity<List<AppointmentResponse>> getWaitingTokens(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(queueService.getWaitingTokens(industry));
    }

    @PutMapping("/next")
    public ResponseEntity<AppointmentResponse> callNextToken(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(queueService.callNextToken(industry));
    }

    @PutMapping("/skip/{id}")
    public ResponseEntity<AppointmentResponse> skipToken(@NonNull @PathVariable Long id, @RequestParam(required = false) String industry) {
        return ResponseEntity.ok(queueService.skipToken(id, industry));
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<AppointmentResponse> completeToken(@NonNull @PathVariable Long id) {
        return ResponseEntity.ok(queueService.completeToken(id));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<AppointmentResponse> cancelToken(@NonNull @PathVariable Long id) {
        return ResponseEntity.ok(queueService.cancelToken(id));
    }
}
