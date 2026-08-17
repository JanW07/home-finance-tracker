package com.home.finance_tracker.transaction.repository;

import com.home.finance_tracker.stats.dto.response.CategoryStatResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthSummaryResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthlyTrendResponseDTO;
import com.home.finance_tracker.stats.dto.response.TopTransactionResponseDTO;
import com.home.finance_tracker.transaction.entity.Transaction;
import com.home.finance_tracker.transaction.entity.TransactionType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCategoryId(Long categoryId);
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByCategoryIdAndUserId(Long categoryId, Long userId);
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);

    @Query("""
    SELECT new com.home.finance_tracker.stats.dto.response.CategoryStatResponseDTO(
        c.id,
        c.name,
        c.icon,
        SUM(t.amount),
        t.transactionType
    )
    FROM Transaction t
    JOIN t.category c
    WHERE t.user.id = :userId AND t.transactionDate >= :start AND t.transactionDate < :end AND t.transactionType = :type
    GROUP BY c.id, c.name, c.icon, t.transactionType
    ORDER BY SUM(t.amount) DESC
""")
    List<CategoryStatResponseDTO> getCategoryStats(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("type") TransactionType type
    );

    @Query("""
    SELECT new com.home.finance_tracker.stats.dto.response.MonthlyTrendResponseDTO(
        CAST(FUNCTION('TO_CHAR', t.transactionDate, 'YYYY-MM') AS string),
        COALESCE(SUM(CASE WHEN t.transactionType = 'INCOME' THEN t.amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN t.transactionType = 'EXPENSE' THEN t.amount ELSE 0 END), 0)
    )
    FROM Transaction t
    WHERE t.user.id = :userId AND t.transactionDate >= :start AND t.transactionDate < :end
    GROUP BY FUNCTION('TO_CHAR', t.transactionDate, 'YYYY-MM')
    ORDER BY FUNCTION('TO_CHAR', t.transactionDate, 'YYYY-MM')
""")
    List<MonthlyTrendResponseDTO> getMonthlyTrend(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("""
    SELECT new com.home.finance_tracker.stats.dto.response.MonthSummaryResponseDTO(
        COALESCE(SUM(CASE WHEN t.transactionType = 'INCOME' THEN t.amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN t.transactionType = 'EXPENSE' THEN t.amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN t.transactionType = 'INCOME' THEN t.amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN t.transactionType = 'EXPENSE' THEN t.amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN t.transactionType = 'EXPENSE' AND t.subscription IS NOT NULL THEN t.amount ELSE 0 END), 0)
    )
    FROM Transaction t
    WHERE t.user.id = :userId AND t.transactionDate >= :start AND t.transactionDate < :end
""")
    MonthSummaryResponseDTO getMonthSummary(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("""
    SELECT new com.home.finance_tracker.stats.dto.response.TopTransactionResponseDTO(
        t.id,
        t.title,
        t.amount,
        t.transactionType,
        c.name,
        c.icon,
        t.transactionDate
    )
    FROM Transaction t
    JOIN t.category c
    WHERE t.user.id = :userId AND t.transactionDate >= :start AND t.transactionDate < :end AND t.transactionType = :type
    ORDER BY t.amount DESC
""")
    List<TopTransactionResponseDTO> getTopTransactions(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("type") TransactionType type,
            Pageable pageable
    );
}