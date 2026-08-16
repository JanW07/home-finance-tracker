package com.home.finance_tracker.subscription.repository;

import com.home.finance_tracker.subscription.entity.Subscription;
import com.home.finance_tracker.subscription.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    List<Subscription> findByCategoryId(Long categoryId);
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByCategoryIdAndUserId(Long categoryId, Long userId);
    Optional<Subscription> findByIdAndUserId(Long id, Long userId);

    List<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.status = :status AND s.nextBillingPeriod <= :nextBillingPeriod")
    List<Subscription> findByUserIdAndStatusAndNextBillingPeriodLessThanEqual(
            @Param("userId") Long userId,
            @Param("status") SubscriptionStatus status,
            @Param("nextBillingPeriod") LocalDate nextBillingPeriod);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);
}
