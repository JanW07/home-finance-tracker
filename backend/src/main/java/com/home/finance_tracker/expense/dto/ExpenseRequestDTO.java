package com.home.finance_tracker.expense.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ExpenseRequestDTO {
    private String title;
    private BigDecimal amount;
    private String currency;
    private Long categoryId;
}
