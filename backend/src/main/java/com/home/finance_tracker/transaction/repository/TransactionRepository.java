package com.home.finance_tracker.transaction.repository;

import com.home.finance_tracker.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCategoryId(Long categoryId);
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByCategoryIdAndUserId(Long categoryId, Long userId);
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);
}
