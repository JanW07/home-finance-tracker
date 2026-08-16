package com.home.finance_tracker.subscription.dto;

import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SubscriptionResponseDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private String currency;
    private LocalDate nextPaymentDate;
    private CategoryResponseDTO category;
}
