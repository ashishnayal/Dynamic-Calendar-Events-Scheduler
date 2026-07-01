package com.nettuscheduler.service;

import com.nettuscheduler.domain.User;
import com.nettuscheduler.domain.Calendar;
import com.nettuscheduler.domain.CalendarEvent;
import com.nettuscheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final CalendarService calendarService;
    private final EventService eventService;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUser(String id) {
        return userRepository.findById(id);
    }

    public List<User> getUsersByAccountId(String accountId) {
        return userRepository.findByAccountId(accountId);
    }

    public List<User> getUsersByMeta(String key, String value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("metadata." + key).is(value));
        return mongoTemplate.find(query, User.class);
    }

    public List<CalendarEvent> getFreeBusy(String userId, Long startTs, Long endTs) {
        // Simplified calculation: fetch all events for all calendars belonging to the user
        List<Calendar> calendars = calendarService.getCalendarsByUserId(userId);
        return calendars.stream()
                .flatMap(calendar -> eventService.getEventsByCalendarId(calendar.getId()).stream())
                .filter(event -> event.getStartTs() != null && event.getEndTs() != null)
                .filter(event -> event.getStartTs() <= endTs && event.getEndTs() >= startTs)
                .collect(Collectors.toList());
    }

    public User updateUser(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setMetadata(updatedUser.getMetadata());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
