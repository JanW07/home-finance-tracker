package com.home.finance_tracker.expense.repository;

import com.home.finance_tracker.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCategoryId(Long categoryId);
    List<Expense> findByUserId(Long userId);
    List<Expense> findByCategoryIdAndUserId(Long categoryId, Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);
}
