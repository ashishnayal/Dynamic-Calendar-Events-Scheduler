package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "accounts")
public class Account {
    @Id
    private String id;
    
    // Removing secretApiKey and publicJwtKey as requested (no auth)

    private AccountSettings settings;

    @Data
    public static class AccountSettings {
        private AccountWebhookSettings webhook;
    }

    @Data
    public static class AccountWebhookSettings {
        private String url;
        private String key;
    }
}
