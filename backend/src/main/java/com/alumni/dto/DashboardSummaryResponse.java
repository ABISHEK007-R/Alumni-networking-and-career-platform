package com.alumni.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardSummaryResponse {
    private long alumniCount;

    private long mentorCount;

    private long internshipCount;

    private long referralCount;
}
