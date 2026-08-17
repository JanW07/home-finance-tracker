package com.home.finance_tracker.subscription.service;

import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.subscription.dto.SubscriptionRequestDTO;
import com.home.finance_tracker.subscription.dto.SubscriptionResponseDTO;
import com.home.finance_tracker.subscription.entity.BillingPeriod;
import com.home.finance_tracker.subscription.entity.Subscription;
import com.home.finance_tracker.subscription.entity.SubscriptionStatus;
import com.home.finance_tracker.subscription.mapper.SubscriptionMapper;
import com.home.finance_tracker.subscription.repository.SubscriptionRepository;
import com.home.finance_tracker.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SubscriptionMapper subscriptionMapper;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User currentUser;
    private Category category;
    private Subscription subscription;
    private SubscriptionRequestDTO subscriptionRequestDTO;
    private SubscriptionResponseDTO subscriptionResponseDTO;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);

        category = new Category();
        category.setId(10L);

        subscription = new Subscription();
        subscription.setId(100L);
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        subscriptionRequestDTO = new SubscriptionRequestDTO();
        subscriptionRequestDTO.setCategoryId(10L);

        subscriptionResponseDTO = new SubscriptionResponseDTO();
        subscriptionResponseDTO.setId(100L);

        lenient().when(currentUserProvider.getLoggedInUser()).thenReturn(currentUser);
    }

    @Nested
    @DisplayName("createSubscription tests")
    class CreateSubscriptionTests {

        @Test
        @DisplayName("createSubscription - Happy Path")
        void createSubscription_Success() {
            when(categoryRepository.findByIdAndUserId(subscriptionRequestDTO.getCategoryId(), currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(subscriptionMapper.toEntity(subscriptionRequestDTO)).thenReturn(subscription);
            when(subscriptionRepository.save(subscription)).thenReturn(subscription);
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            SubscriptionResponseDTO result = subscriptionService.createSubscription(subscriptionRequestDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100L);
            assertThat(subscription.getCategory()).isEqualTo(category);
            assertThat(subscription.getUser()).isEqualTo(currentUser);

            verify(subscriptionRepository).save(subscription);
        }

        @Test
        @DisplayName("createSubscription - throws AppException when category not found")
        void createSubscription_CategoryNotFound_ThrowsException() {
            when(categoryRepository.findByIdAndUserId(subscriptionRequestDTO.getCategoryId(), currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.createSubscription(subscriptionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("getSubscription tests")
    class GetSubscriptionTests {

        @Test
        @DisplayName("getSubscription - Happy Path")
        void getSubscription_Success() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            SubscriptionResponseDTO result = subscriptionService.getSubscription(100L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100L);
        }

        @Test
        @DisplayName("getSubscription - throws AppException when ID is null")
        void getSubscription_NullId_ThrowsException() {
            assertThatThrownBy(() -> subscriptionService.getSubscription(null))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.INVALID_ID);
        }

        @Test
        @DisplayName("getSubscription - throws AppException when subscription not found")
        void getSubscription_NotFound_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.getSubscription(100L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("getAllSubscriptions tests")
    class GetAllSubscriptionsTests {

        @Test
        @DisplayName("getAllSubscriptions - Happy Path")
        void getAllSubscriptions_Success() {
            when(subscriptionRepository.findByUserId(currentUser.getId()))
                    .thenReturn(Collections.singletonList(subscription));
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            List<SubscriptionResponseDTO> result = subscriptionService.getAllSubscriptions();

            assertThat(result).isNotNull().hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(100L);
        }
    }

    @Nested
    @DisplayName("updateSubscription tests")
    class UpdateSubscriptionTests {

        @Test
        @DisplayName("updateSubscription - Happy Path with category update")
        void updateSubscription_Success_WithCategoryUpdate() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(subscriptionRepository.save(subscription)).thenReturn(subscription);
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            SubscriptionResponseDTO result = subscriptionService.updateSubscription(100L, subscriptionRequestDTO);

            assertThat(result).isNotNull();
            assertThat(subscription.getCategory()).isEqualTo(category);
            verify(subscriptionMapper).updateEntityFromDTO(subscriptionRequestDTO, subscription);
            verify(subscriptionRepository).save(subscription);
        }

        @Test
        @DisplayName("updateSubscription - Happy Path without category update")
        void updateSubscription_Success_WithoutCategoryUpdate() {
            SubscriptionRequestDTO requestWithoutCategory = new SubscriptionRequestDTO();
            requestWithoutCategory.setCategoryId(null);

            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionRepository.save(subscription)).thenReturn(subscription);
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            SubscriptionResponseDTO result = subscriptionService.updateSubscription(100L, requestWithoutCategory);

            assertThat(result).isNotNull();
            verify(categoryRepository, never()).findByIdAndUserId(any(), any());
            verify(subscriptionMapper).updateEntityFromDTO(requestWithoutCategory, subscription);
            verify(subscriptionRepository).save(subscription);
        }

        @Test
        @DisplayName("updateSubscription - throws AppException when subscription not found")
        void updateSubscription_SubscriptionNotFound_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.updateSubscription(100L, subscriptionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        @DisplayName("updateSubscription - throws AppException when category not found")
        void updateSubscription_CategoryNotFound_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.updateSubscription(100L, subscriptionRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("deleteSubscription tests")
    class DeleteSubscriptionTests {

        @Test
        @DisplayName("deleteSubscription - Happy Path")
        void deleteSubscription_Success() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));

            subscriptionService.deleteSubscription(100L);

            verify(subscriptionRepository).delete(subscription);
        }

        @Test
        @DisplayName("deleteSubscription - throws AppException when subscription not found")
        void deleteSubscription_NotFound_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.deleteSubscription(100L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_NOT_FOUND);

            verify(subscriptionRepository, never()).delete(any());
        }
    }

    @Nested
    @DisplayName("changeStatus tests")
    class ChangeStatusTests {

        @Test
        @DisplayName("changeStatus - Happy Path")
        void changeStatus_Success() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionRepository.save(subscription)).thenReturn(subscription);
            when(subscriptionMapper.toDTO(subscription)).thenReturn(subscriptionResponseDTO);

            SubscriptionResponseDTO result = subscriptionService.changeStatus(100L, "CANCELLED");

            assertThat(result).isNotNull();
            assertThat(subscription.getStatus()).isEqualTo(SubscriptionStatus.CANCELLED);
            verify(subscriptionRepository).save(subscription);
        }

        @Test
        @DisplayName("changeStatus - throws AppException when subscription not found")
        void changeStatus_SubscriptionNotFound_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.changeStatus(100L, "CANCELLED"))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        @DisplayName("changeStatus - throws AppException when status name is invalid")
        void changeStatus_InvalidStatusName_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));

            assertThatThrownBy(() -> subscriptionService.changeStatus(100L, "INVALID_STATUS"))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_STATUS_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        @DisplayName("changeStatus - throws AppException when status name is null")
        void changeStatus_NullStatusName_ThrowsException() {
            when(subscriptionRepository.findByIdAndUserId(100L, currentUser.getId()))
                    .thenReturn(Optional.of(subscription));

            assertThatThrownBy(() -> subscriptionService.changeStatus(100L, null))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.SUBSCRIPTION_STATUS_NOT_FOUND);

            verify(subscriptionRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("generateDueTransactions tests")
    class GenerateDueTransactionsTests {

        @Test
        @DisplayName("generateDueTransactions - Happy Path updates next billing period")
        void generateDueTransactions_Success() {
            BillingPeriod billingPeriodMock = mock(BillingPeriod.class);
            LocalDate nextDate = LocalDate.now().plusMonths(1);
            when(billingPeriodMock.nextDateFrom(any(LocalDate.class))).thenReturn(nextDate);

            subscription.setBillingPeriod(billingPeriodMock);

            when(subscriptionRepository.findByUserIdAndStatusAndNextBillingPeriodLessThanEqual(
                    eq(currentUser.getId()), eq(SubscriptionStatus.ACTIVE), any(LocalDate.class)))
                    .thenReturn(List.of(subscription));

            subscriptionService.generateDueTransactions();

            assertThat(subscription.getNextBillingPeriod()).isEqualTo(nextDate);
            verify(subscriptionRepository).save(subscription);
        }

        @Test
        @DisplayName("generateDueTransactions - does nothing when no subscriptions are due")
        void generateDueTransactions_NoDueSubscriptions() {
            when(subscriptionRepository.findByUserIdAndStatusAndNextBillingPeriodLessThanEqual(
                    eq(currentUser.getId()), eq(SubscriptionStatus.ACTIVE), any(LocalDate.class)))
                    .thenReturn(Collections.emptyList());

            subscriptionService.generateDueTransactions();

            verify(subscriptionRepository, never()).save(any());
        }
    }
}