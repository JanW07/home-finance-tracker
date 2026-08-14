package com.home.finance_tracker.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
public class ExpenseRequestDTO {
    private String title;
    private BigDecimal amount;
    private String currency;
    private Long categoryId;
}
