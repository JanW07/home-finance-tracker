package com.home.finance_tracker.transaction.service;

import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.transaction.dto.TransactionRequestDTO;
import com.home.finance_tracker.transaction.dto.TransactionResponseDTO;
import com.home.finance_tracker.transaction.entity.Transaction;
import com.home.finance_tracker.transaction.mapper.TransactionMapper;
import com.home.finance_tracker.transaction.repository.TransactionRepository;
import com.home.finance_tracker.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private CurrentUserProvider currentUserProvider;

    public TransactionResponseDTO createTransaction(TransactionRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Transaction transaction = transactionMapper.toEntity(dto);
        transaction.setCategory(category);
        transaction.setUser(currentUser);

        transactionRepository.save(transaction);
        return transactionMapper.toDTO(transaction);
    }

    public TransactionResponseDTO getTransaction(Long transactionId){
        if(transactionId == null){
            throw new AppException(ErrorCode.INVALID_ID);
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));
        return transactionMapper.toDTO(transaction);
    }

    public List<TransactionResponseDTO> getAllTransactions(){
        User currentUser = currentUserProvider.getLoggedInUser();

        return transactionRepository.findByUserId(currentUser.getId())
                .stream()
                .map(transactionMapper::toDTO)
                .toList();
    }

    public TransactionResponseDTO updateTransaction(Long id, TransactionRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Transaction transaction = transactionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        if(dto.getCategoryId() != null){
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            transaction.setCategory(category);
        }

        transactionMapper.updateEntityFromDTO(dto, transaction);
        transactionRepository.save(transaction);

        return transactionMapper.toDTO(transaction);
    }

    public void deleteTransaction(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Transaction transaction = transactionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));
        transactionRepository.delete(transaction);
    }
}
