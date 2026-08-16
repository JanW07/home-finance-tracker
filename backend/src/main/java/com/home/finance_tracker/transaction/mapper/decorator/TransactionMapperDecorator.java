package com.home.finance_tracker.transaction.mapper.decorator;

import com.home.finance_tracker.transaction.dto.TransactionResponseDTO;
import com.home.finance_tracker.transaction.entity.Transaction;
import com.home.finance_tracker.transaction.mapper.TransactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public abstract class TransactionMapperDecorator implements TransactionMapper {

    @Autowired
    @Qualifier("delegate")
    private TransactionMapper delegate;

    @Override
    public TransactionResponseDTO toDTO(Transaction entity){
        if(entity == null){
            return null;
        }

        TransactionResponseDTO dto = delegate.toDTO(entity);

        if(entity.getSubscription() != null){
            dto.setSubscriptionId(entity.getSubscription().getId());
        }

        return dto;
    }
}
