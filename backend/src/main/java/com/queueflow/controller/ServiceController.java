package com.queueflow.controller;

import com.queueflow.entity.ServiceEntity;
import com.queueflow.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.lang.NonNull;
import com.queueflow.repository.UserRepository;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices(@RequestParam(required = false) String industry) {
        if (industry != null && !industry.isEmpty()) {
            return ResponseEntity.ok(serviceRepository.findByIndustry(industry));
        }
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@NonNull @PathVariable Long id) {
        return ResponseEntity.ok(serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found")));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceEntity> createService(@NonNull @RequestBody ServiceEntity service, Authentication authentication) {
        // Guarantee industry is never null or empty
        if (service.getIndustry() == null || service.getIndustry().trim().isEmpty()) {
            // Try to get industry from authenticated admin user
            String email = authentication.getName();
            String userIndustry = userRepository.findByEmail(email)
                    .map(user -> user.getIndustry())
                    .orElse(null);
            service.setIndustry(userIndustry != null && !userIndustry.trim().isEmpty() ? userIndustry : "General");
        }
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceEntity> updateService(@NonNull @PathVariable Long id, @RequestBody ServiceEntity serviceDetails) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        service.setServiceName(serviceDetails.getServiceName());
        service.setDescription(serviceDetails.getDescription());
        service.setDuration(serviceDetails.getDuration());
        service.setIsActive(serviceDetails.getIsActive());
        service.setIndustry(serviceDetails.getIndustry());
        
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@NonNull @PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found");
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
