package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Document(collection = "calendars")
public class Calendar {
    @Id
    private String id;
    
    private String userId;
    private String accountId;
    
    private CalendarSettings settings;
    private Map<String, Object> metadata;

    @Data
    public static class CalendarSettings {
        private String weekStart; // e.g., "Mon"
        private String timezone; // e.g., "UTC"
    }
}
