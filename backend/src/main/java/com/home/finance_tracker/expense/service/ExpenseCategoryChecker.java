package com.home.finance_tracker.expense.service;

import com.home.finance_tracker.category.service.CategoryUsageChecker;
import com.home.finance_tracker.category.service.CategoryUsageResult;
import com.home.finance_tracker.expense.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExpenseCategoryChecker implements CategoryUsageChecker {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseCategoryChecker(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public CategoryUsageResult checkUsage(Long categoryId, Long userId){
        boolean exists = expenseRepository.existsByCategoryIdAndUserId(categoryId, userId);
        return exists ? CategoryUsageResult.usedIn("Expenses") : CategoryUsageResult.unused();
    }
}
