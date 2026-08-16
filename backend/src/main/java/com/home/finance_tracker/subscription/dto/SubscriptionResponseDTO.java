package com.home.finance_tracker.subscription.dto;

import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.subscription.entity.BillingPeriod;
import com.home.finance_tracker.subscription.entity.SubscriptionStatus;
import com.home.finance_tracker.transaction.entity.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SubscriptionResponseDTO {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String currency;
    private CategoryResponseDTO category;
    private BillingPeriod billingPeriod;
    private LocalDate nextBillingPeriod;
    private SubscriptionStatus status;
    private TransactionType transactionType;
}
