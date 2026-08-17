package com.home.finance_tracker.stats.service;

import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.stats.dto.response.CategoryStatResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthSummaryResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthlyTrendResponseDTO;
import com.home.finance_tracker.stats.dto.response.TopTransactionResponseDTO;
import com.home.finance_tracker.transaction.entity.TransactionType;
import com.home.finance_tracker.transaction.repository.TransactionRepository;
import com.home.finance_tracker.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StatsService {
    @Autowired
    private CurrentUserProvider currentUserProvider;
    @Autowired
    TransactionRepository transactionRepository;

    public List<CategoryStatResponseDTO> getCategoryStats(YearMonth month, TransactionType type) {
        User currentUser = currentUserProvider.getLoggedInUser();

        LocalDate startOfMonth = month.atDay(1);
        LocalDate startOfNextMonth = month.plusMonths(1).atDay(1);

        List<CategoryStatResponseDTO> stats = transactionRepository.getCategoryStats(
                currentUser.getId(), startOfMonth, startOfNextMonth, type
        );

        BigDecimal total = stats.stream()
                .map(CategoryStatResponseDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.forEach(stat -> stat.setPercentage(calculatePercentage(stat.getTotal(), total)));

        return stats;
    }

    public List<MonthlyTrendResponseDTO> getMonthlyTrend(int months) {
        User currentUser = currentUserProvider.getLoggedInUser();

        YearMonth currentMonth = YearMonth.now();
        YearMonth startMonth = currentMonth.minusMonths(months - 1L);

        LocalDate start = startMonth.atDay(1);
        LocalDate end = currentMonth.plusMonths(1).atDay(1);

        List<MonthlyTrendResponseDTO> stats = transactionRepository.getMonthlyTrend(
                currentUser.getId(), start, end
        );

        Map<String, MonthlyTrendResponseDTO> byMonth = stats.stream()
                .collect(Collectors.toMap(MonthlyTrendResponseDTO::getMonth, Function.identity()));

        List<MonthlyTrendResponseDTO> result = new ArrayList<>();
        for (int i = 0; i < months; i++) {
            YearMonth month = startMonth.plusMonths(i);
            String key = month.toString();

            result.add(byMonth.getOrDefault(key,
                    new MonthlyTrendResponseDTO(key, BigDecimal.ZERO, BigDecimal.ZERO)));
        }

        return result;
    }

    public MonthSummaryResponseDTO getMonthSummary(YearMonth month) {
        User currentUser = currentUserProvider.getLoggedInUser();

        LocalDate startOfMonth = month.atDay(1);
        LocalDate startOfNextMonth = month.plusMonths(1).atDay(1);

        return transactionRepository.getMonthSummary(currentUser.getId(), startOfMonth, startOfNextMonth);
    }


    public List<TopTransactionResponseDTO> getTopTransactions(YearMonth month, TransactionType type, int limit) {
        User currentUser = currentUserProvider.getLoggedInUser();

        LocalDate startOfMonth = month.atDay(1);
        LocalDate startOfNextMonth = month.plusMonths(1).atDay(1);

        Pageable pageable = PageRequest.of(0, limit);

        return transactionRepository.getTopTransactions(
                currentUser.getId(), startOfMonth, startOfNextMonth, type, pageable
        );
    }



    private double calculatePercentage(BigDecimal part, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return part.divide(total, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
