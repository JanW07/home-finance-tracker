package com.home.finance_tracker.service;

import com.home.finance_tracker.dto.request.ExpenseRequestDTO;
import com.home.finance_tracker.dto.response.ExpenseResponseDTO;
import com.home.finance_tracker.entity.Category;
import com.home.finance_tracker.entity.Expense;
import com.home.finance_tracker.entity.User;
import com.home.finance_tracker.mapper.ExpenseMapper;
import com.home.finance_tracker.repository.CategoryRepository;
import com.home.finance_tracker.repository.ExpenseRepository;
import com.home.finance_tracker.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ExpenseMapper expenseMapper;
    @Autowired
    private CurrentUserProvider currentUserProvider;

    public ExpenseResponseDTO createExpense(ExpenseRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Expense expense = expenseMapper.toEntity(dto);
        expense.setCategory(category);
        expense.setUser(currentUser);

        expenseRepository.save(expense);
        return expenseMapper.toDTO(expense);
    }

    public ExpenseResponseDTO getExpense(Long expenseId){
        if(expenseId == null){
            throw new IllegalArgumentException("Expense id cannot be null");
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Expense expense = expenseRepository.findByIdAndUserId(expenseId, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        return expenseMapper.toDTO(expense);
    }

    public List<ExpenseResponseDTO> getAllExpenses(){
        User currentUser = currentUserProvider.getLoggedInUser();

        return expenseRepository.findByUserId(currentUser.getId())
                .stream()
                .map(expenseMapper::toDTO)
                .toList();
    }

    public ExpenseResponseDTO updateExpense(Long id, ExpenseRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Expense expense = expenseRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        if(dto.getCategoryId() != null){
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            expense.setCategory(category);
        }

        expenseMapper.updateEntityFromDTO(dto, expense);
        expenseRepository.save(expense);

        return expenseMapper.toDTO(expense);
    }

    public void deleteExpense(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Expense expense = expenseRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        expenseRepository.delete(expense);
    }
}