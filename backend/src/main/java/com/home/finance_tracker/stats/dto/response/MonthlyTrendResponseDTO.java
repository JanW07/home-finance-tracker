package com.home.finance_tracker.stats.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyTrendResponseDTO {
    private String month;
    private BigDecimal income;
    private BigDecimal expense;
}
