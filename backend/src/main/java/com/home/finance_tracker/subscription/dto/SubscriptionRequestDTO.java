package com.home.finance_tracker.subscription.dto;

import com.home.finance_tracker.subscription.entity.BillingPeriod;
import com.home.finance_tracker.subscription.entity.SubscriptionStatus;
import com.home.finance_tracker.transaction.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SubscriptionRequestDTO {
    @NotNull
    private String title;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private String currency;

    @NotNull
    private Long categoryId;

    @NotNull
    private BillingPeriod billingPeriod;

    @NotNull
    private LocalDate nextBillingPeriod;

    @NotNull
    private SubscriptionStatus status;

    @NotNull
    private TransactionType transactionType;
}
