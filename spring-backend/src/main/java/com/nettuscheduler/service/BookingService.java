package com.nettuscheduler.service;

import com.nettuscheduler.domain.Service;
import com.nettuscheduler.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import com.nettuscheduler.domain.BookingIntend;
import com.nettuscheduler.repository.BookingIntendRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingService {

    private final ServiceRepository serviceRepository;
    private final BookingIntendRepository bookingIntendRepository;
    private final MongoTemplate mongoTemplate;

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Optional<Service> getService(String id) {
        return serviceRepository.findById(id);
    }

    public List<Service> getServicesByAccountId(String accountId) {
        return serviceRepository.findByAccountId(accountId);
    }

    public List<Service> getServicesByMeta(String key, String value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("metadata." + key).is(value));
        return mongoTemplate.find(query, Service.class);
    }

    public Service updateService(String id, Service updatedService) {
        return serviceRepository.findById(id).map(service -> {
            service.setMultiPerson(updatedService.getMultiPerson());
            service.setMetadata(updatedService.getMetadata());
            service.setUsers(updatedService.getUsers());
            return serviceRepository.save(service);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void deleteService(String id) {
        serviceRepository.deleteById(id);
    }

    public Service addUserToService(String serviceId, Service.ServiceResource user) {
        return serviceRepository.findById(serviceId).map(service -> {
            if (service.getUsers() == null) {
                service.setUsers(new ArrayList<>());
            }
            // Remove existing user if any to replace
            service.getUsers().removeIf(u -> u.getUserId().equals(user.getUserId()));
            service.getUsers().add(user);
            return serviceRepository.save(service);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public Service removeUserFromService(String serviceId, String userId) {
        return serviceRepository.findById(serviceId).map(service -> {
            if (service.getUsers() != null) {
                service.getUsers().removeIf(u -> u.getUserId().equals(userId));
                return serviceRepository.save(service);
            }
            return service;
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public Service updateServiceUser(String serviceId, String userId, Service.ServiceResource updatedUser) {
        return serviceRepository.findById(serviceId).map(service -> {
            if (service.getUsers() != null) {
                service.getUsers().stream()
                        .filter(u -> u.getUserId().equals(userId))
                        .findFirst()
                        .ifPresent(u -> {
                            u.setAvailability(updatedUser.getAvailability());
                            u.setBufferAfter(updatedUser.getBufferAfter());
                            u.setBufferBefore(updatedUser.getBufferBefore());
                            u.setClosestBookingTime(updatedUser.getClosestBookingTime());
                            u.setFurthestBookingTime(updatedUser.getFurthestBookingTime());
                        });
                return serviceRepository.save(service);
            }
            return service;
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public BookingIntend createBookingIntend(BookingIntend intend) {
        intend.setCreatedAt(System.currentTimeMillis());
        return bookingIntendRepository.save(intend);
    }

    public void removeBookingIntend(String id) {
        bookingIntendRepository.deleteById(id);
    }

    public List<BookingIntend> getBookingSlots(String serviceId, Long startTs, Long endTs) {
        // Simplified mapping: just return intents/slots in that service range
        // A true implementation would calculate free/busy + schedule expansion
        return bookingIntendRepository.findByServiceId(serviceId);
    }
}
