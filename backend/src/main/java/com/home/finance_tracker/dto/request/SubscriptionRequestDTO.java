package com.home.finance_tracker.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SubscriptionRequestDTO {
    private String name;
    private BigDecimal amount;
    private String currency;
    private LocalDate nextPaymentDate;
    private Long categoryId;
}
