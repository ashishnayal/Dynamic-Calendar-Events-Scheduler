package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "booking_intends")
public class BookingIntend {
    @Id
    private String id;
    
    private String serviceId;
    private String accountId;
    private String userId; // Optional, if a specific user is targeted
    private Long startTs;
    private Long endTs;
    private Long createdAt;
}
