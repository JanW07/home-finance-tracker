package com.home.finance_tracker.category.service;

public interface CategoryUsageChecker {
    CategoryUsageResult checkUsage(Long categoryId, Long userId);
}