package com.home.finance_tracker.stats.dto.response;

import com.home.finance_tracker.transaction.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class TopTransactionResponseDTO {
    private Long id;
    private String title;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String categoryName;
    private String icon;
    private LocalDate transactionDate;
}
