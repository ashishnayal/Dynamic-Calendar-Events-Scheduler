package com.nettuscheduler.repository;

import com.nettuscheduler.domain.CalendarEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<CalendarEvent, String> {
    List<CalendarEvent> findByCalendarId(String calendarId);
    List<CalendarEvent> findByUserId(String userId);
}
