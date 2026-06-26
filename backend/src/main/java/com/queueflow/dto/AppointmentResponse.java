package com.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private String tokenNo;
    private String serviceName;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String userName;
    private String userEmail;
    private Integer estimatedWaitMinutes;
    private String qrCodeBase64;
}
