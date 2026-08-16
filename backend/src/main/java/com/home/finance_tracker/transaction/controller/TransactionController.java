package com.home.finance_tracker.transaction.controller;

import com.home.finance_tracker.transaction.dto.TransactionRequestDTO;
import com.home.finance_tracker.transaction.dto.TransactionResponseDTO;
import com.home.finance_tracker.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> addTransaction(@Valid @RequestBody TransactionRequestDTO dto){
        TransactionResponseDTO transaction = transactionService.createTransaction(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getAllTransactions(){
        List<TransactionResponseDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id){
        TransactionResponseDTO transaction = transactionService.getTransaction(id);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRequestDTO dto){
        TransactionResponseDTO transaction = transactionService.updateTransaction(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id){
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
