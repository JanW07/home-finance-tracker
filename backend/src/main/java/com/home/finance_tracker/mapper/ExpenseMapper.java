package com.home.finance_tracker.mapper;

import com.home.finance_tracker.dto.request.ExpenseRequestDTO;
import com.home.finance_tracker.dto.response.ExpenseResponseDTO;
import com.home.finance_tracker.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {
    Expense toEntity(ExpenseRequestDTO dto);

    ExpenseResponseDTO toDTO(Expense entity);

    void updateEntityFromDTO(ExpenseRequestDTO dto, @MappingTarget Expense expense);
}
