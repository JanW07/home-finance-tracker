package com.home.finance_tracker.transaction.dto;

import com.home.finance_tracker.transaction.entity.BillingPeriod;
import com.home.finance_tracker.transaction.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class TransactionRequestDTO {
    @NotNull
    private String title;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private String currency = "PLN";

    @NotNull
    private LocalDate transactionDate;

    @NotNull
    private TransactionType transactionType;

    @NotNull
    private Long categoryId;

    private Boolean isSubscription = false;

    private BillingPeriod billingPeriod;
}
