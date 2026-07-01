package com.nettuscheduler.controller;

import com.nettuscheduler.domain.CalendarEvent;
import com.nettuscheduler.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody CalendarEvent event) {
        return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEvent> getEvent(@PathVariable String id) {
        return eventService.getEvent(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar/{calendarId}")
    public ResponseEntity<List<CalendarEvent>> getEventsByCalendar(@PathVariable String calendarId) {
        return ResponseEntity.ok(eventService.getEventsByCalendarId(calendarId));
    }

    @GetMapping("/meta")
    public ResponseEntity<List<CalendarEvent>> getEventsByMeta(@RequestParam String key, @RequestParam String value) {
        return ResponseEntity.ok(eventService.getEventsByMeta(key, value));
    }

    @GetMapping("/{id}/instances")
    public ResponseEntity<List<CalendarEvent>> getEventInstances(
            @PathVariable String id,
            @RequestParam Long startTs,
            @RequestParam Long endTs) {
        return ResponseEntity.ok(eventService.getEventInstances(id, startTs, endTs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable String id, @RequestBody CalendarEvent event) {
        try {
            return ResponseEntity.ok(eventService.updateEvent(id, event));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
