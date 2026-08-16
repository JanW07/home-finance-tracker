package com.home.finance_tracker.transaction.dto;

import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.transaction.entity.BillingPeriod;
import com.home.finance_tracker.transaction.entity.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class TransactionResponseDTO {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String currency;
    private LocalDate transactionDate;
    private TransactionType transactionType;
    private CategoryResponseDTO category;
    private Boolean isSubscription;
    private BillingPeriod billingPeriod;
}
