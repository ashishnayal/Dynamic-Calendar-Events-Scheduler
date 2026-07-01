package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Document(collection = "schedules")
public class Schedule {
    @Id
    private String id;
    
    private String userId;
    private String accountId;
    
    private List<ScheduleRule> rules;
    private String timezone;
    private Map<String, Object> metadata;

    @Data
    public static class ScheduleRule {
        private String variantType; // e.g., "WDay" or "Date"
        private String variantValue; // e.g., "Mon" or "1970-01-12"
        private List<ScheduleRuleInterval> intervals;
    }

    @Data
    public static class ScheduleRuleInterval {
        private Time start;
        private Time end;
    }

    @Data
    public static class Time {
        private Integer hours;
        private Integer minutes;
    }
}
