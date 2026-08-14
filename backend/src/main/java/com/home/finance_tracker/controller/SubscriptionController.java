package com.home.finance_tracker.controller;

import com.home.finance_tracker.dto.request.SubscriptionRequestDTO;
import com.home.finance_tracker.dto.response.SubscriptionResponseDTO;
import com.home.finance_tracker.service.SubscriptionService;
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
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllSubscriptions(){
        List<SubscriptionResponseDTO> subscriptions = subscriptionService.getAllSubscriptions();
        return ResponseEntity.status(HttpStatus.OK).body(subscriptions);
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

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<SubscriptionResponseDTO> deactivateSubscription(@PathVariable Long id){
        SubscriptionResponseDTO subscription = subscriptionService.deactivateSubscription(id);
        return ResponseEntity.status(HttpStatus.OK).body(subscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id){
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}