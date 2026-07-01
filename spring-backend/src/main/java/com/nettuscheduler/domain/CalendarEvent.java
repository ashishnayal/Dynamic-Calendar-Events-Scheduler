package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Document(collection = "events")
public class CalendarEvent {
    @Id
    private String id;
    
    private Long startTs;
    private Long duration;
    private Boolean busy;
    private Long endTs;
    private Long created;
    private Long updated;
    
    private Map<String, Object> recurrence; // Stored as a generic map for now to map RRuleOptions
    private List<Long> exdates;
    
    private String calendarId;
    private String userId;
    private String accountId;
    private String serviceId;
    
    private List<CalendarEventReminder> reminders;
    private Map<String, Object> metadata;

    @Data
    public static class CalendarEventReminder {
        private Long delta;
        private String identifier;
    }
}
