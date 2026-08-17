package com.home.finance_tracker.subscription;

import com.home.finance_tracker.subscription.scheduler.SubscriptionScheduler;
import com.home.finance_tracker.subscription.service.SubscriptionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SubscriptionSchedulerTest {

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private SubscriptionScheduler subscriptionScheduler;

    @Test
    @DisplayName("runGenerateDueTransactions - triggers subscriptionService method")
    void runGenerateDueTransactions_TriggersService() {
        subscriptionScheduler.runGenerateDueTransactions();

        verify(subscriptionService).generateDueTransactions();
    }
}