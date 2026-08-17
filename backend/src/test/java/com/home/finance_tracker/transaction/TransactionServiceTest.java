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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private TransactionService transactionService;

    private User currentUser;
    private Category category;
    private Transaction transaction;
    private TransactionRequestDTO transactionRequestDTO;
    private TransactionResponseDTO transactionResponseDTO;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);

        category = new Category();
        category.setId(10L);

        transaction = new Transaction();
        transaction.setId(100L);

        transactionRequestDTO = new TransactionRequestDTO();
        transactionRequestDTO.setCategoryId(10L);

        transactionResponseDTO = new TransactionResponseDTO();
        transactionResponseDTO.setId(100L);

        lenient().when(currentUserProvider.getLoggedInUser()).thenReturn(currentUser);
    }

    @Nested
    @DisplayName("createTransaction tests")
    class CreateTransactionTests {

        @Test
        @DisplayName("createTransaction - Happy Path")
        void createTransaction_Success() {
            when(categoryRepository.findByIdAndUserId(transactionRequestDTO.getCategoryId(), currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(transactionMapper.toEntity(transactionRequestDTO)).thenReturn(transaction);
            when(transactionRepository.save(transaction)).thenReturn(transaction);
            when(transactionMapper.toDTO(transaction)).thenReturn(transactionResponseDTO);

            TransactionResponseDTO result = transactionService.createTransaction(transactionRequestDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100L);
            assertThat(transaction.getCategory()).isEqualTo(category);
            assertThat(transaction.getUser()).isEqualTo(currentUser);

            verify(transactionRepository).save(transaction);
        }

        @Test
        @DisplayName("createTransaction - throws AppException when category not found")
        void createTransaction_CategoryNotFound_ThrowsException() {
            when(categoryRepository.findByIdAndUserId(transactionRequestDTO.getCategoryId(), currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.createTransaction(transactionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(transactionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("getTransaction tests")
    class GetTransactionTests {

        @Test
        @DisplayName("getTransaction - Happy Path")
        void getTransaction_Success() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(transaction));
            when(transactionMapper.toDTO(transaction)).thenReturn(transactionResponseDTO);

            TransactionResponseDTO result = transactionService.getTransaction(100L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100L);
        }

        @Test
        @DisplayName("getTransaction - throws AppException when ID is null")
        void getTransaction_NullId_ThrowsException() {
            assertThatThrownBy(() -> transactionService.getTransaction(null))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.INVALID_ID);
        }

        @Test
        @DisplayName("getTransaction - throws AppException when transaction not found")
        void getTransaction_NotFound_ThrowsException() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.getTransaction(100L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("getAllTransactions tests")
    class GetAllTransactionsTests {

        @Test
        @DisplayName("getAllTransactions - Happy Path")
        void getAllTransactions_Success() {
            when(transactionRepository.findByUserId(currentUser.getId()))
                    .thenReturn(Collections.singletonList(transaction));
            when(transactionMapper.toDTO(transaction)).thenReturn(transactionResponseDTO);

            List<TransactionResponseDTO> result = transactionService.getAllTransactions();

            assertThat(result).isNotNull().hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(100L);
        }
    }

    @Nested
    @DisplayName("updateTransaction tests")
    class UpdateTransactionTests {

        @Test
        @DisplayName("updateTransaction - Happy Path with category update")
        void updateTransaction_Success_WithCategoryUpdate() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(transaction));
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(transactionRepository.save(transaction)).thenReturn(transaction);
            when(transactionMapper.toDTO(transaction)).thenReturn(transactionResponseDTO);

            TransactionResponseDTO result = transactionService.updateTransaction(100L, transactionRequestDTO);

            assertThat(result).isNotNull();
            assertThat(transaction.getCategory()).isEqualTo(category);
            verify(transactionMapper).updateEntityFromDTO(transactionRequestDTO, transaction);
            verify(transactionRepository).save(transaction);
        }

        @Test
        @DisplayName("updateTransaction - Happy Path without category update")
        void updateTransaction_Success_WithoutCategoryUpdate() {
            TransactionRequestDTO requestWithoutCategory = new TransactionRequestDTO();
            requestWithoutCategory.setCategoryId(null);

            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(transaction));
            when(transactionRepository.save(transaction)).thenReturn(transaction);
            when(transactionMapper.toDTO(transaction)).thenReturn(transactionResponseDTO);

            TransactionResponseDTO result = transactionService.updateTransaction(100L, requestWithoutCategory);

            assertThat(result).isNotNull();
            verify(categoryRepository, never()).findByIdAndUserId(any(), any());
            verify(transactionMapper).updateEntityFromDTO(requestWithoutCategory, transaction);
            verify(transactionRepository).save(transaction);
        }

        @Test
        @DisplayName("updateTransaction - throws AppException when transaction not found")
        void updateTransaction_TransactionNotFound_ThrowsException() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.updateTransaction(100L, transactionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);

            verify(transactionRepository, never()).save(any());
        }

        @Test
        @DisplayName("updateTransaction - throws AppException when new category not found")
        void updateTransaction_CategoryNotFound_ThrowsException() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(transaction));
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.updateTransaction(100L, transactionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(transactionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("deleteTransaction tests")
    class DeleteTransactionTests {

        @Test
        @DisplayName("deleteTransaction - Happy Path")
        void deleteTransaction_Success() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(transaction));

            transactionService.deleteTransaction(100L);

            verify(transactionRepository).delete(transaction);
        }

        @Test
        @DisplayName("deleteTransaction - throws AppException when transaction not found")
        void deleteTransaction_NotFound_ThrowsException() {
            when(transactionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.deleteTransaction(100L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);

            verify(transactionRepository, never()).delete(any());
        }
    }
}