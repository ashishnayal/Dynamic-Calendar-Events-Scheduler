package com.nettuscheduler.controller;

import com.nettuscheduler.domain.User;
import com.nettuscheduler.domain.CalendarEvent;
import com.nettuscheduler.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        return userService.getUser(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<User>> getUsersByAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(userService.getUsersByAccountId(accountId));
    }

    @GetMapping("/meta")
    public ResponseEntity<List<User>> getUsersByMeta(@RequestParam String key, @RequestParam String value) {
        return ResponseEntity.ok(userService.getUsersByMeta(key, value));
    }

    @GetMapping("/{id}/freebusy")
    public ResponseEntity<List<CalendarEvent>> getFreeBusy(
            @PathVariable String id, 
            @RequestParam Long startTs, 
            @RequestParam Long endTs) {
        return ResponseEntity.ok(userService.getFreeBusy(id, startTs, endTs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
