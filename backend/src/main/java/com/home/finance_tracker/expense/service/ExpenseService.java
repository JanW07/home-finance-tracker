package com.home.finance_tracker.expense.service;

import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.expense.dto.ExpenseRequestDTO;
import com.home.finance_tracker.expense.dto.ExpenseResponseDTO;
import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.expense.entity.Expense;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.expense.mapper.ExpenseMapper;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.expense.repository.ExpenseRepository;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
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
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Expense expense = expenseMapper.toEntity(dto);
        expense.setCategory(category);
        expense.setUser(currentUser);
        expense.setPurchaseDate(new Timestamp(System.currentTimeMillis()));

        expenseRepository.save(expense);
        return expenseMapper.toDTO(expense);
    }

    public ExpenseResponseDTO getExpense(Long expenseId){
        if(expenseId == null){
            throw new AppException(ErrorCode.INVALID_ID);
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Expense expense = expenseRepository.findByIdAndUserId(expenseId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOT_FOUND));
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
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOT_FOUND));

        if(dto.getCategoryId() != null){
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            expense.setCategory(category);
        }

        expenseMapper.updateEntityFromDTO(dto, expense);
        expenseRepository.save(expense);

        return expenseMapper.toDTO(expense);
    }

    public void deleteExpense(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Expense expense = expenseRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOT_FOUND));
        expenseRepository.delete(expense);
    }
}