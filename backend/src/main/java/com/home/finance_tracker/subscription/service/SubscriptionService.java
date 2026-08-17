package com.home.finance_tracker.subscription.service;

import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.subscription.dto.SubscriptionRequestDTO;
import com.home.finance_tracker.subscription.dto.SubscriptionResponseDTO;
import com.home.finance_tracker.subscription.entity.Subscription;
import com.home.finance_tracker.subscription.entity.SubscriptionStatus;
import com.home.finance_tracker.subscription.mapper.SubscriptionMapper;
import com.home.finance_tracker.subscription.repository.SubscriptionRepository;
import com.home.finance_tracker.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private SubscriptionMapper subscriptionMapper;
    @Autowired
    private CurrentUserProvider currentUserProvider;

    public SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Subscription subscription = subscriptionMapper.toEntity(dto);
        subscription.setCategory(category);
        subscription.setUser(currentUser);

        subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(subscription);
    }

    public SubscriptionResponseDTO getSubscription(Long subscriptionId){
        if(subscriptionId == null){
            throw new AppException(ErrorCode.INVALID_ID);
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        return subscriptionMapper.toDTO(subscription);
    }

    public List<SubscriptionResponseDTO> getAllSubscriptions(){
        User currentUser = currentUserProvider.getLoggedInUser();

        return subscriptionRepository.findByUserId(currentUser.getId())
                .stream()
                .map(subscriptionMapper::toDTO)
                .toList();
    }

    public SubscriptionResponseDTO updateSubscription(Long subscriptionId, SubscriptionRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

        if(dto.getCategoryId() != null){
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            subscription.setCategory(category);
        }

        subscriptionMapper.updateEntityFromDTO(dto, subscription);
        subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }

    public void deleteSubscription(Long subscriptionId){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        subscriptionRepository.delete(subscription);
    }



    public SubscriptionResponseDTO changeStatus(Long subscriptionId, String statusName){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));


        SubscriptionStatus newStatus;
        try {
            newStatus = SubscriptionStatus.valueOf(statusName.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppException(ErrorCode.SUBSCRIPTION_STATUS_NOT_FOUND);
        }

        subscription.setStatus(newStatus);

        subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(subscription);
    }

    @Transactional
    public void generateDueTransactions(){
        User currentUser = currentUserProvider.getLoggedInUser();

        List<Subscription> subscriptions = subscriptionRepository
                .findByUserIdAndStatusAndNextBillingPeriodLessThanEqual(
                        currentUser.getId(), SubscriptionStatus.ACTIVE, LocalDate.now()
                );
        if(subscriptions.isEmpty()){
            return;
        }

        subscriptions.forEach(subscription -> {
            subscription.setNextBillingPeriod(subscription.getBillingPeriod().nextDateFrom(LocalDate.now()));
            subscriptionRepository.save(subscription);
        });
    }


}
