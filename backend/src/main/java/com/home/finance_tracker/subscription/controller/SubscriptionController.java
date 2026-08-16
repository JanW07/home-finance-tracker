package com.home.finance_tracker.subscription.controller;

import com.home.finance_tracker.subscription.dto.SubscriptionRequestDTO;
import com.home.finance_tracker.subscription.dto.SubscriptionResponseDTO;
import com.home.finance_tracker.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionResponseDTO> addSubscription(@Valid @RequestBody SubscriptionRequestDTO dto){
        SubscriptionResponseDTO subscription = subscriptionService.createSubscription(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllTSubscription(){
        List<SubscriptionResponseDTO> subscription = subscriptionService.getAllSubscriptions();
        return ResponseEntity.status(HttpStatus.OK).body(subscription);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> getSubscriptionById(@PathVariable Long id){
        SubscriptionResponseDTO subscription = subscriptionService.getSubscription(id);
        return ResponseEntity.status(HttpStatus.OK).body(subscription);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> updateSubscription(@PathVariable Long id, @Valid @RequestBody SubscriptionRequestDTO dto){
        SubscriptionResponseDTO subscription = subscriptionService.updateSubscription(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(subscription);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SubscriptionResponseDTO> changeStatus(@PathVariable Long id, String status){
        SubscriptionResponseDTO subscription = subscriptionService.changeStatus(id, status);
        return ResponseEntity.status(HttpStatus.OK).body(subscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id){
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}
