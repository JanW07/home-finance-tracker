package com.home.finance_tracker.transaction.mapper;

import com.home.finance_tracker.transaction.dto.TransactionRequestDTO;
import com.home.finance_tracker.transaction.dto.TransactionResponseDTO;
import com.home.finance_tracker.transaction.entity.Transaction;
import com.home.finance_tracker.transaction.mapper.decorator.TransactionMapperDecorator;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
@DecoratedWith(TransactionMapperDecorator.class)
public interface TransactionMapper {
    Transaction toEntity(TransactionRequestDTO dto);

    TransactionResponseDTO toDTO(Transaction entity);

    void updateEntityFromDTO(TransactionRequestDTO dto, @MappingTarget Transaction transaction);
}
