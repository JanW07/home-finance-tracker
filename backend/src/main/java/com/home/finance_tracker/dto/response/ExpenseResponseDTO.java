package com.home.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
public class ExpenseResponseDTO {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String currency;
    private Timestamp purchaseDate;
    private CategoryResponseDTO category;
}
