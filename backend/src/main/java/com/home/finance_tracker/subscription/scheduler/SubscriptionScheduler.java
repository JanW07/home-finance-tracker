package com.home.finance_tracker.subscription.scheduler;

import com.home.finance_tracker.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionScheduler {
    @Autowired
    SubscriptionService subscriptionService;

    @Scheduled(cron = "0 0 6 * * *")
    public void runGenerateDueTransactions() {
        subscriptionService.generateDueTransactions();
    }
}
