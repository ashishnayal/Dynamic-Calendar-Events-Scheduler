package com.nettuscheduler.repository;

import com.nettuscheduler.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByAccountId(String accountId);
}
