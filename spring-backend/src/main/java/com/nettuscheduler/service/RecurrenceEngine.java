package com.nettuscheduler.service;

import com.nettuscheduler.domain.CalendarEvent;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class RecurrenceEngine {

    /**
     * Expands a single CalendarEvent into multiple instances if it contains recurrence rules.
     * Generates instances up to the given end window limit.
     */
    public List<CalendarEvent> expand(CalendarEvent baseEvent, Long windowStartTs, Long windowEndTs) {
        if (baseEvent.getRecurrence() == null || baseEvent.getRecurrence().isEmpty()) {
            // No recurrence, just return the base event if it overlaps
            if (overlaps(baseEvent.getStartTs(), baseEvent.getEndTs(), windowStartTs, windowEndTs)) {
                return List.of(baseEvent);
            }
            return List.of();
        }

        List<CalendarEvent> instances = new ArrayList<>();
        Map<String, Object> rule = baseEvent.getRecurrence();
        
        String freq = (String) rule.getOrDefault("freq", "daily");
        int interval = (int) rule.getOrDefault("interval", 1);
        
        // Use UTC for clean 24h/7d offsets
        ZoneId zone = ZoneId.of("UTC");
        ZonedDateTime currentStart = ZonedDateTime.ofInstant(Instant.ofEpochMilli(baseEvent.getStartTs()), zone);
        ZonedDateTime currentEnd = ZonedDateTime.ofInstant(Instant.ofEpochMilli(baseEvent.getEndTs()), zone);

        // Limit expansion to a maximum of 52 instances to prevent infinite loops
        int maxInstances = 52;
        int count = 0;

        while (currentStart.toInstant().toEpochMilli() <= windowEndTs && count < maxInstances) {
            long sTs = currentStart.toInstant().toEpochMilli();
            long eTs = currentEnd.toInstant().toEpochMilli();

            // Check if this instance overlaps with the requested timespan window
            if (overlaps(sTs, eTs, windowStartTs, windowEndTs)) {
                CalendarEvent instance = cloneEvent(baseEvent, sTs, eTs);
                instances.add(instance);
            }

            // Increment based on frequency
            if ("weekly".equalsIgnoreCase(freq)) {
                currentStart = currentStart.plusWeeks(interval);
                currentEnd = currentEnd.plusWeeks(interval);
            } else if ("daily".equalsIgnoreCase(freq)) {
                currentStart = currentStart.plusDays(interval);
                currentEnd = currentEnd.plusDays(interval);
            } else {
                break; // Unsupported frequency
            }
            
            count++;
        }

        return instances;
    }

    private boolean overlaps(Long s1, Long e1, Long s2, Long e2) {
        if (s1 == null || e1 == null || s2 == null || e2 == null) return false;
        return s1 <= e2 && e1 >= s2;
    }

    private CalendarEvent cloneEvent(CalendarEvent base, long newStart, long newEnd) {
        CalendarEvent clone = new CalendarEvent();
        clone.setId(base.getId() + "_" + newStart); // Create unique virtual ID
        clone.setStartTs(newStart);
        clone.setEndTs(newEnd);
        clone.setDuration(base.getDuration());
        clone.setBusy(base.getBusy());
        clone.setCalendarId(base.getCalendarId());
        clone.setUserId(base.getUserId());
        clone.setAccountId(base.getAccountId());
        clone.setServiceId(base.getServiceId());
        clone.setMetadata(base.getMetadata());
        clone.setRecurrence(base.getRecurrence());
        return clone;
    }
}
