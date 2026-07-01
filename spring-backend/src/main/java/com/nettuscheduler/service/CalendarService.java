package com.nettuscheduler.service;

import com.nettuscheduler.domain.Calendar;
import com.nettuscheduler.repository.CalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final MongoTemplate mongoTemplate;

    public Calendar createCalendar(Calendar calendar) {
        return calendarRepository.save(calendar);
    }

    public Optional<Calendar> getCalendar(String id) {
        return calendarRepository.findById(id);
    }

    public List<Calendar> getCalendarsByUserId(String userId) {
        return calendarRepository.findByUserId(userId);
    }

    public List<Calendar> getCalendarsByMeta(String key, String value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("metadata." + key).is(value));
        return mongoTemplate.find(query, Calendar.class);
    }

    public Calendar updateCalendar(String id, Calendar updatedCalendar) {
        return calendarRepository.findById(id).map(calendar -> {
            calendar.setSettings(updatedCalendar.getSettings());
            calendar.setMetadata(updatedCalendar.getMetadata());
            return calendarRepository.save(calendar);
        }).orElseThrow(() -> new RuntimeException("Calendar not found"));
    }

    public void deleteCalendar(String id) {
        calendarRepository.deleteById(id);
    }
}
