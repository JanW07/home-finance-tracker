package com.home.finance_tracker.stats.dto.response;

import com.home.finance_tracker.transaction.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CategoryStatResponseDTO {
    private Long categoryId;
    private String categoryName;
    private String icon;
    private BigDecimal total;
    private TransactionType transactionType;
    private double percentage;

    public CategoryStatResponseDTO(Long categoryId, String categoryName, String icon,
                                   BigDecimal total, TransactionType transactionType) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.icon = icon;
        this.total = total;
        this.transactionType = transactionType;
    }
}
