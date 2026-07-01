package com.nettuscheduler.controller;

import com.nettuscheduler.domain.Service;
import com.nettuscheduler.domain.BookingIntend;
import com.nettuscheduler.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return new ResponseEntity<>(bookingService.createService(service), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getService(@PathVariable String id) {
        return bookingService.getService(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Service>> getServicesByAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(bookingService.getServicesByAccountId(accountId));
    }

    @GetMapping("/meta")
    public ResponseEntity<List<Service>> getServicesByMeta(@RequestParam String key, @RequestParam String value) {
        return ResponseEntity.ok(bookingService.getServicesByMeta(key, value));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable String id, @RequestBody Service service) {
        try {
            return ResponseEntity.ok(bookingService.updateService(id, service));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        bookingService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/users")
    public ResponseEntity<Service> addUserToService(@PathVariable String id, @RequestBody Service.ServiceResource user) {
        return ResponseEntity.ok(bookingService.addUserToService(id, user));
    }

    @DeleteMapping("/{id}/users/{userId}")
    public ResponseEntity<Service> removeUserFromService(@PathVariable String id, @PathVariable String userId) {
        return ResponseEntity.ok(bookingService.removeUserFromService(id, userId));
    }

    @PutMapping("/{id}/users/{userId}")
    public ResponseEntity<Service> updateServiceUser(@PathVariable String id, @PathVariable String userId, @RequestBody Service.ServiceResource user) {
        return ResponseEntity.ok(bookingService.updateServiceUser(id, userId, user));
    }

    @GetMapping("/{id}/booking")
    public ResponseEntity<List<BookingIntend>> getBookingSlots(
            @PathVariable String id,
            @RequestParam Long startTs,
            @RequestParam Long endTs) {
        return ResponseEntity.ok(bookingService.getBookingSlots(id, startTs, endTs));
    }

    @PostMapping("/{id}/booking-intend")
    public ResponseEntity<BookingIntend> createBookingIntend(@PathVariable String id, @RequestBody BookingIntend intend) {
        intend.setServiceId(id);
        return new ResponseEntity<>(bookingService.createBookingIntend(intend), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/booking-intend/{intendId}")
    public ResponseEntity<Void> removeBookingIntend(@PathVariable String id, @PathVariable String intendId) {
        bookingService.removeBookingIntend(intendId);
        return ResponseEntity.noContent().build();
    }
}
