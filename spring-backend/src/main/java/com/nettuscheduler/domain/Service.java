package com.nettuscheduler.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Document(collection = "services")
public class Service {
    @Id
    private String id;
    
    private String accountId;
    private ServiceMultiPersonOptions multiPerson;
    private Map<String, Object> metadata;
    
    // In Nettu, users registered to a service are ServiceResource. We can map them as embedded or separate collection.
    // For simplicity, we'll embed them if it's not a standalone collection, or we can use a separate `service_resources` collection.
    // The rust code has `ServiceResource` with id format `service_id#user_id`.
    private List<ServiceResource> users;

    @Data
    public static class ServiceMultiPersonOptions {
        private String variant; // e.g., "RoundRobinAlgorithm", "Collective", "Group"
        private Object data; // Could be round robin strategy data or group size
    }

    @Data
    public static class ServiceResource {
        private String userId;
        private String serviceId;
        private TimePlan availability;
        private Long bufferAfter;
        private Long bufferBefore;
        private Long closestBookingTime;
        private Long furthestBookingTime;
    }

    @Data
    public static class TimePlan {
        private String variant; // "Calendar", "Schedule", "Empty"
        private String id; // The id of the calendar or schedule
    }
}
