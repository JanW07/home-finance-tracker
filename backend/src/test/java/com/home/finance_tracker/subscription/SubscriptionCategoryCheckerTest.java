package com.home.finance_tracker.subscription;

import com.home.finance_tracker.category.service.CategoryUsageResult;
import com.home.finance_tracker.subscription.repository.SubscriptionRepository;
import com.home.finance_tracker.subscription.service.SubscriptionCategoryChecker;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionCategoryCheckerTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionCategoryChecker subscriptionCategoryChecker;

    @Nested
    @DisplayName("checkUsage tests")
    class CheckUsageTests {

        @Test
        @DisplayName("checkUsage - returns usedIn('Subscription') when subscriptions exist")
        void checkUsage_WhenSubscriptionsExist_ReturnsUsedIn() {
            Long categoryId = 10L;
            Long userId = 1L;

            when(subscriptionRepository.existsByCategoryIdAndUserId(categoryId, userId)).thenReturn(true);

            CategoryUsageResult result = subscriptionCategoryChecker.checkUsage(categoryId, userId);

            assertThat(result.isUsed()).isTrue();
            assertThat(result.getModuleName()).isEqualTo("Subscription");
            verify(subscriptionRepository).existsByCategoryIdAndUserId(categoryId, userId);
        }

        @Test
        @DisplayName("checkUsage - returns unused() when subscriptions do not exist")
        void checkUsage_WhenSubscriptionsDoNotExist_ReturnsUnused() {
            Long categoryId = 10L;
            Long userId = 1L;

            when(subscriptionRepository.existsByCategoryIdAndUserId(categoryId, userId)).thenReturn(false);

            CategoryUsageResult result = subscriptionCategoryChecker.checkUsage(categoryId, userId);

            assertThat(result.isUsed()).isFalse();
            assertThat(result.getModuleName()).isNull();
            verify(subscriptionRepository).existsByCategoryIdAndUserId(categoryId, userId);
        }
    }
}