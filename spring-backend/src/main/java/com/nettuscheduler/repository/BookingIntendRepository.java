package com.nettuscheduler.repository;

import com.nettuscheduler.domain.BookingIntend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingIntendRepository extends MongoRepository<BookingIntend, String> {
    List<BookingIntend> findByServiceId(String serviceId);
}
