package com.home.finance_tracker.category.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryUsageResult {
    private final boolean used;
    private final String moduleName;

    public static CategoryUsageResult unused() {
        return new CategoryUsageResult(false, null);
    }

    public static CategoryUsageResult usedIn(String moduleName) {
        return new CategoryUsageResult(true, moduleName);
    }
}