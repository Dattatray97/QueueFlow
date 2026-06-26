package com.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalUsers;
    private long todayBookings;
    private long waitingTokens;
    private long completedTokens;
    private long cancelledTokens;
    private long inProgressTokens;
}
