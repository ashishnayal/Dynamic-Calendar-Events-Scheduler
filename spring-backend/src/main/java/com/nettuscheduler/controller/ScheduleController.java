package com.nettuscheduler.controller;

import com.nettuscheduler.domain.Schedule;
import com.nettuscheduler.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        return new ResponseEntity<>(scheduleService.createSchedule(schedule), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getSchedule(@PathVariable String id) {
        return scheduleService.getSchedule(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Schedule>> getSchedulesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByUserId(userId));
    }

    @GetMapping("/meta")
    public ResponseEntity<List<Schedule>> getSchedulesByMeta(@RequestParam String key, @RequestParam String value) {
        return ResponseEntity.ok(scheduleService.getSchedulesByMeta(key, value));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable String id, @RequestBody Schedule schedule) {
        try {
            return ResponseEntity.ok(scheduleService.updateSchedule(id, schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
