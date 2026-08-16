package com.home.finance_tracker.subscription.repository;

import com.home.finance_tracker.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByCategoryId(Long categoryId);
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByCategoryIdAndUserId(Long categoryId, Long userId);
    Optional<Subscription> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);
}
