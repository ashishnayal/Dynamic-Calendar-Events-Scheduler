package com.nettuscheduler.repository;

import com.nettuscheduler.domain.Service;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {
    List<Service> findByAccountId(String accountId);
}
