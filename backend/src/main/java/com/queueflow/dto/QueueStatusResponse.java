package com.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueStatusResponse {
    private String currentServingToken;
    private String currentServiceName;
    private String yourToken;
    private Integer waitingAhead;
    private Integer estimatedWaitMinutes;
    private List<AppointmentResponse> waitingTokens;
}
