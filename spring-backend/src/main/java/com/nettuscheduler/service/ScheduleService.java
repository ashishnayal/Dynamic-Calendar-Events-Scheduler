package com.nettuscheduler.service;

import com.nettuscheduler.domain.Schedule;
import com.nettuscheduler.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final MongoTemplate mongoTemplate;

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Optional<Schedule> getSchedule(String id) {
        return scheduleRepository.findById(id);
    }

    public List<Schedule> getSchedulesByUserId(String userId) {
        return scheduleRepository.findByUserId(userId);
    }

    public List<Schedule> getSchedulesByMeta(String key, String value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("metadata." + key).is(value));
        return mongoTemplate.find(query, Schedule.class);
    }

    public Schedule updateSchedule(String id, Schedule updatedSchedule) {
        return scheduleRepository.findById(id).map(schedule -> {
            schedule.setRules(updatedSchedule.getRules());
            schedule.setTimezone(updatedSchedule.getTimezone());
            schedule.setMetadata(updatedSchedule.getMetadata());
            return scheduleRepository.save(schedule);
        }).orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    public void deleteSchedule(String id) {
        scheduleRepository.deleteById(id);
    }
}
