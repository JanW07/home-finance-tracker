package com.home.finance_tracker.category;

import com.home.finance_tracker.category.service.CategoryUsageResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CategoryUsageResultTest {

    @Test
    @DisplayName("unused - should create result with used=false and null moduleName")
    void unused_ShouldCreateUnusedResult() {
        CategoryUsageResult result = CategoryUsageResult.unused();

        assertThat(result.isUsed()).isFalse();
        assertThat(result.getModuleName()).isNull();
    }

    @Test
    @DisplayName("usedIn - should create result with used=true and correct moduleName")
    void usedIn_ShouldCreateUsedResult() {
        CategoryUsageResult result = CategoryUsageResult.usedIn("Transaction");

        assertThat(result.isUsed()).isTrue();
        assertThat(result.getModuleName()).isEqualTo("Transaction");
    }
}