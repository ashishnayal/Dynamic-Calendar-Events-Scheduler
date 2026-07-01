package com.nettuscheduler.controller;

import com.nettuscheduler.domain.Calendar;
import com.nettuscheduler.domain.CalendarEvent;
import com.nettuscheduler.service.CalendarService;
import com.nettuscheduler.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendars")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<Calendar> createCalendar(@RequestBody Calendar calendar) {
        return new ResponseEntity<>(calendarService.createCalendar(calendar), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Calendar> getCalendar(@PathVariable String id) {
        return calendarService.getCalendar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Calendar>> getCalendarsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(calendarService.getCalendarsByUserId(userId));
    }

    @GetMapping("/meta")
    public ResponseEntity<List<Calendar>> getCalendarsByMeta(@RequestParam String key, @RequestParam String value) {
        return ResponseEntity.ok(calendarService.getCalendarsByMeta(key, value));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<CalendarEvent>> getCalendarEvents(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventsByCalendarId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Calendar> updateCalendar(@PathVariable String id, @RequestBody Calendar calendar) {
        try {
            return ResponseEntity.ok(calendarService.updateCalendar(id, calendar));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalendar(@PathVariable String id) {
        calendarService.deleteCalendar(id);
        return ResponseEntity.noContent().build();
    }
}
