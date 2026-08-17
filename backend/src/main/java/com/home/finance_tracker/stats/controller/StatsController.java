package com.home.finance_tracker.stats.controller;

import com.home.finance_tracker.stats.dto.response.CategoryStatResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthSummaryResponseDTO;
import com.home.finance_tracker.stats.dto.response.MonthlyTrendResponseDTO;
import com.home.finance_tracker.stats.dto.response.TopTransactionResponseDTO;
import com.home.finance_tracker.stats.service.StatsService;
import com.home.finance_tracker.transaction.entity.TransactionType;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/by-category")
    public ResponseEntity<List<CategoryStatResponseDTO>> getCategoryStats(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            @RequestParam TransactionType type) {

        return ResponseEntity.ok(statsService.getCategoryStats(month, type));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<MonthlyTrendResponseDTO>> getMonthlyTrend(
            @RequestParam(defaultValue = "6") int months) {

        return ResponseEntity.ok(statsService.getMonthlyTrend(months));
    }

    @GetMapping("/summary")
    public ResponseEntity<MonthSummaryResponseDTO> getMonthSummary(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {

        return ResponseEntity.ok(statsService.getMonthSummary(month));
    }

    @GetMapping("/top-transactions")
    public ResponseEntity<List<TopTransactionResponseDTO>> getTopTransactions(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            @RequestParam TransactionType type,
            @RequestParam(defaultValue = "5") int limit) {

        return ResponseEntity.ok(statsService.getTopTransactions(month, type, limit));
    }
}
