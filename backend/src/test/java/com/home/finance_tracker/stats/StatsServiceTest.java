package com.home.finance_tracker.stats;

import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.stats.dto.response.CategoryStatResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthSummaryResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthlyTrendResponseDTO;
import com.home.finance_tracker.stats.dto.response.TopTransactionResponseDTO;
import com.home.finance_tracker.stats.service.StatsService;
import com.home.finance_tracker.transaction.entity.TransactionType;
import com.home.finance_tracker.transaction.repository.TransactionRepository;
import com.home.finance_tracker.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private StatsService statsService;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);

        lenient().when(currentUserProvider.getLoggedInUser()).thenReturn(currentUser);
    }

    @Nested
    @DisplayName("getMonthSummary tests")
    class GetMonthSummaryTests {

        @Test
        @DisplayName("getMonthSummary - Happy Path")
        void getMonthSummary_Success() {
            YearMonth month = YearMonth.of(2026, 8);

            MonthSummaryResponseDTO expected = MonthSummaryResponseDTO.builder()
                    .totalIncome(BigDecimal.valueOf(5000))
                    .totalExpense(BigDecimal.valueOf(3000))
                    .balance(BigDecimal.valueOf(2000))
                    .subscriptionsShare(BigDecimal.valueOf(500))
                    .build();

            when(transactionRepository.getMonthSummary(eq(1L), any(), any()))
                    .thenReturn(expected);

            MonthSummaryResponseDTO result = statsService.getMonthSummary(month);

            assertThat(result).isEqualTo(expected);
        }

        @Test
        @DisplayName("getMonthSummary - queries with correct start/end of month boundaries")
        void getMonthSummary_CorrectDateRange() {
            YearMonth month = YearMonth.of(2026, 8);

            when(transactionRepository.getMonthSummary(eq(1L), any(), any()))
                    .thenReturn(MonthSummaryResponseDTO.builder().build());

            statsService.getMonthSummary(month);

            ArgumentCaptor<LocalDate> startCaptor = ArgumentCaptor.forClass(LocalDate.class);
            ArgumentCaptor<LocalDate> endCaptor = ArgumentCaptor.forClass(LocalDate.class);

            verify(transactionRepository).getMonthSummary(eq(1L), startCaptor.capture(), endCaptor.capture());

            assertThat(startCaptor.getValue()).isEqualTo(LocalDate.of(2026, 8, 1));
            assertThat(endCaptor.getValue()).isEqualTo(LocalDate.of(2026, 9, 1));
        }
    }

    @Nested
    @DisplayName("getCategoryStats tests")
    class GetCategoryStatsTests {

        @Test
        @DisplayName("getCategoryStats - calculates percentage share correctly")
        void getCategoryStats_CalculatesPercentage() {
            YearMonth month = YearMonth.of(2026, 8);

            CategoryStatResponseDTO food = new CategoryStatResponseDTO(
                    1L, "Food", "🍔", BigDecimal.valueOf(300), TransactionType.EXPENSE);
            CategoryStatResponseDTO transport = new CategoryStatResponseDTO(
                    2L, "Transport", "🚗", BigDecimal.valueOf(100), TransactionType.EXPENSE);

            when(transactionRepository.getCategoryStats(eq(1L), any(), any(), eq(TransactionType.EXPENSE)))
                    .thenReturn(List.of(food, transport));

            List<CategoryStatResponseDTO> result = statsService.getCategoryStats(month, TransactionType.EXPENSE);

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getPercentage()).isEqualTo(75.0);
            assertThat(result.get(1).getPercentage()).isEqualTo(25.0);
        }

        @Test
        @DisplayName("getCategoryStats - returns empty list when no transactions in month")
        void getCategoryStats_EmptyList() {
            YearMonth month = YearMonth.of(2026, 8);

            when(transactionRepository.getCategoryStats(eq(1L), any(), any(), eq(TransactionType.EXPENSE)))
                    .thenReturn(List.of());

            List<CategoryStatResponseDTO> result = statsService.getCategoryStats(month, TransactionType.EXPENSE);

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("getCategoryStats - filters by requested transaction type")
        void getCategoryStats_FiltersByType() {
            YearMonth month = YearMonth.of(2026, 8);

            statsService.getCategoryStats(month, TransactionType.INCOME);

            verify(transactionRepository).getCategoryStats(eq(1L), any(), any(), eq(TransactionType.INCOME));
        }
    }

    @Nested
    @DisplayName("getMonthlyTrend tests")
    class GetMonthlyTrendTests {

        @Test
        @DisplayName("getMonthlyTrend - fills gaps with zero for months missing from repository result")
        void getMonthlyTrend_FillsMissingMonths() {
            YearMonth currentMonth = YearMonth.now();
            String presentMonthKey = currentMonth.toString();

            MonthlyTrendResponseDTO presentMonth = new MonthlyTrendResponseDTO(
                    presentMonthKey, BigDecimal.valueOf(1000), BigDecimal.valueOf(500));

            when(transactionRepository.getMonthlyTrend(eq(1L), any(), any()))
                    .thenReturn(List.of(presentMonth));

            List<MonthlyTrendResponseDTO> result = statsService.getMonthlyTrend(3);

            assertThat(result).hasSize(3);
            assertThat(result.get(2).getMonth()).isEqualTo(presentMonthKey);
            assertThat(result.get(2).getIncome()).isEqualByComparingTo(BigDecimal.valueOf(1000));

            assertThat(result.get(0).getIncome()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(result.get(0).getExpense()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("getMonthlyTrend - returns exactly N months regardless of repository result size")
        void getMonthlyTrend_ReturnsRequestedMonthsCount() {
            when(transactionRepository.getMonthlyTrend(eq(1L), any(), any()))
                    .thenReturn(List.of());

            List<MonthlyTrendResponseDTO> result = statsService.getMonthlyTrend(6);

            assertThat(result).hasSize(6);
        }

        @Test
        @DisplayName("getMonthlyTrend - result is chronologically ordered")
        void getMonthlyTrend_ChronologicalOrder() {
            when(transactionRepository.getMonthlyTrend(eq(1L), any(), any()))
                    .thenReturn(List.of());

            List<MonthlyTrendResponseDTO> result = statsService.getMonthlyTrend(3);

            YearMonth expectedStart = YearMonth.now().minusMonths(2);
            for (int i = 0; i < result.size(); i++) {
                assertThat(result.get(i).getMonth()).isEqualTo(expectedStart.plusMonths(i).toString());
            }
        }
    }

    @Nested
    @DisplayName("getTopTransactions tests")
    class GetTopTransactionsTests {

        @Test
        @DisplayName("getTopTransactions - Happy Path")
        void getTopTransactions_Success() {
            YearMonth month = YearMonth.of(2026, 8);

            TopTransactionResponseDTO topTx = new TopTransactionResponseDTO(
                    1L, "New laptop", BigDecimal.valueOf(4000), TransactionType.EXPENSE,
                    "Electronics", "💻", month.atDay(15));

            when(transactionRepository.getTopTransactions(
                    eq(1L), any(), any(), eq(TransactionType.EXPENSE), any(Pageable.class)))
                    .thenReturn(List.of(topTx));

            List<TopTransactionResponseDTO> result =
                    statsService.getTopTransactions(month, TransactionType.EXPENSE, 5);

            assertThat(result).containsExactly(topTx);
        }

        @Test
        @DisplayName("getTopTransactions - builds Pageable with requested limit as page size, first page")
        void getTopTransactions_BuildsCorrectPageable() {
            YearMonth month = YearMonth.of(2026, 8);

            statsService.getTopTransactions(month, TransactionType.EXPENSE, 3);

            ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);

            verify(transactionRepository).getTopTransactions(
                    eq(1L), any(), any(), eq(TransactionType.EXPENSE), pageableCaptor.capture());

            Pageable pageable = pageableCaptor.getValue();
            assertThat(pageable.getPageNumber()).isEqualTo(0);
            assertThat(pageable.getPageSize()).isEqualTo(3);
        }
    }
}