package com.home.finance_tracker.transaction;

import com.home.finance_tracker.category.service.CategoryUsageResult;
import com.home.finance_tracker.transaction.repository.TransactionRepository;
import com.home.finance_tracker.transaction.service.TransactionCategoryChecker;
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
class TransactionCategoryCheckerTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionCategoryChecker transactionCategoryChecker;

    @Nested
    @DisplayName("checkUsage tests")
    class CheckUsageTests {

        @Test
        @DisplayName("checkUsage - returns usedIn('Transaction') when transactions exist")
        void checkUsage_WhenTransactionsExist_ReturnsUsedIn() {
            Long categoryId = 10L;
            Long userId = 1L;

            when(transactionRepository.existsByCategoryIdAndUserId(categoryId, userId)).thenReturn(true);

            CategoryUsageResult result = transactionCategoryChecker.checkUsage(categoryId, userId);

            assertThat(result.isUsed()).isTrue();
            assertThat(result.getModuleName()).isEqualTo("Transaction");
            verify(transactionRepository).existsByCategoryIdAndUserId(categoryId, userId);
        }

        @Test
        @DisplayName("checkUsage - returns unused() when transactions do not exist")
        void checkUsage_WhenTransactionsDoNotExist_ReturnsUnused() {
            Long categoryId = 10L;
            Long userId = 1L;

            when(transactionRepository.existsByCategoryIdAndUserId(categoryId, userId)).thenReturn(false);

            CategoryUsageResult result = transactionCategoryChecker.checkUsage(categoryId, userId);

            assertThat(result.isUsed()).isFalse();
            assertThat(result.getModuleName()).isNull();
            verify(transactionRepository).existsByCategoryIdAndUserId(categoryId, userId);
        }
    }
}