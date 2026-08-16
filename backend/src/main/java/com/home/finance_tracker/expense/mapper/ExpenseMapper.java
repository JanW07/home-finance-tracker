package com.home.finance_tracker.expense.mapper;

import com.home.finance_tracker.expense.dto.ExpenseRequestDTO;
import com.home.finance_tracker.expense.dto.ExpenseResponseDTO;
import com.home.finance_tracker.expense.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {
    Expense toEntity(ExpenseRequestDTO dto);

    ExpenseResponseDTO toDTO(Expense entity);

    void updateEntityFromDTO(ExpenseRequestDTO dto, @MappingTarget Expense expense);
}
