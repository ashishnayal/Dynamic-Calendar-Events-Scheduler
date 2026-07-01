package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String accountId;
    
    private Map<String, Object> metadata;
}
