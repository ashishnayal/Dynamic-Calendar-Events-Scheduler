package com.nettuscheduler.service;

import com.nettuscheduler.domain.CalendarEvent;
import com.nettuscheduler.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final MongoTemplate mongoTemplate;
    private final RecurrenceEngine recurrenceEngine; // Add engine

    public CalendarEvent createEvent(CalendarEvent event) {
        event.setCreated(System.currentTimeMillis());
        event.setUpdated(System.currentTimeMillis());
        return eventRepository.save(event);
    }

    public Optional<CalendarEvent> getEvent(String id) {
        return eventRepository.findById(id);
    }

    public List<CalendarEvent> getEventsByCalendarId(String calendarId) {
        // Expand events 2 years into the future by default when getting all events
        long now = System.currentTimeMillis();
        long twoYearsLater = now + (1000L * 60 * 60 * 24 * 365 * 2);
        
        List<CalendarEvent> baseEvents = eventRepository.findByCalendarId(calendarId);
        return baseEvents.stream()
                .flatMap(e -> recurrenceEngine.expand(e, 0L, twoYearsLater).stream())
                .toList();
    }

    public List<CalendarEvent> getEventsByMeta(String key, String value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("metadata." + key).is(value));
        return mongoTemplate.find(query, CalendarEvent.class);
    }

    public List<CalendarEvent> getEventInstances(String eventId, Long startTs, Long endTs) {
        return getEvent(eventId)
                .map(event -> recurrenceEngine.expand(event, startTs, endTs))
                .orElse(List.of());
    }

    public CalendarEvent updateEvent(String id, CalendarEvent updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setStartTs(updatedEvent.getStartTs());
            event.setDuration(updatedEvent.getDuration());
            event.setBusy(updatedEvent.getBusy());
            event.setEndTs(updatedEvent.getEndTs());
            event.setRecurrence(updatedEvent.getRecurrence());
            event.setExdates(updatedEvent.getExdates());
            event.setReminders(updatedEvent.getReminders());
            event.setMetadata(updatedEvent.getMetadata());
            event.setUpdated(System.currentTimeMillis());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}
