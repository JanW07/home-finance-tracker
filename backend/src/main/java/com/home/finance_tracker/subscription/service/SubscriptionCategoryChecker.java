package com.home.finance_tracker.subscription.service;

import com.home.finance_tracker.category.service.CategoryUsageChecker;
import com.home.finance_tracker.category.service.CategoryUsageResult;
import com.home.finance_tracker.subscription.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionCategoryChecker implements CategoryUsageChecker {

    @Autowired private SubscriptionRepository subscriptionRepository;

    @Override
    public CategoryUsageResult checkUsage(Long categoryId, Long userId){
        boolean exists = subscriptionRepository.existsByCategoryIdAndUserId(categoryId, userId);
        return exists ? CategoryUsageResult.usedIn("Subscription") : CategoryUsageResult.unused();
    }
}
