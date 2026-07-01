package com.nettuscheduler.repository;

import com.nettuscheduler.domain.Calendar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends MongoRepository<Calendar, String> {
    List<Calendar> findByUserId(String userId);
    List<Calendar> findByAccountId(String accountId);
}
