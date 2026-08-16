package com.home.finance_tracker.transaction.service;

import com.home.finance_tracker.category.service.CategoryUsageChecker;
import com.home.finance_tracker.category.service.CategoryUsageResult;
import com.home.finance_tracker.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransactionCategoryChecker implements CategoryUsageChecker {

    @Autowired private TransactionRepository transactionRepository;

    @Override
    public CategoryUsageResult checkUsage(Long categoryId, Long userId){
        boolean exists = transactionRepository.existsByCategoryIdAndUserId(categoryId, userId);
        return exists ? CategoryUsageResult.usedIn("Transaction") : CategoryUsageResult.unused();
    }
}
