package com.home.finance_tracker.controller;

import com.home.finance_tracker.dto.request.ExpenseRequestDTO;
import com.home.finance_tracker.dto.response.ExpenseResponseDTO;
import com.home.finance_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> addExpense(@Valid @RequestBody ExpenseRequestDTO dto){
        ExpenseResponseDTO expense = expenseService.createExpense(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(expense);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> getAllExpenses(){
        List<ExpenseResponseDTO> expenses = expenseService.getAllExpenses();
        return ResponseEntity.status(HttpStatus.OK).body(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> getExpenseById(@PathVariable Long id){
        ExpenseResponseDTO expense = expenseService.getExpense(id);
        return ResponseEntity.status(HttpStatus.OK).body(expense);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseRequestDTO dto){
        ExpenseResponseDTO expense = expenseService.updateExpense(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id){
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}