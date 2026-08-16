package com.home.finance_tracker.subscription.service;

import com.home.finance_tracker.subscription.dto.SubscriptionRequestDTO;
import com.home.finance_tracker.subscription.dto.SubscriptionResponseDTO;
import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.subscription.entity.Subscription;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.subscription.mapper.SubscriptionMapper;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.subscription.repository.SubscriptionRepository;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Subscription subscription = subscriptionMapper.toEntity(dto);
        subscription.setCategory(category);
        subscription.setUser(currentUser);
        subscription.setActive(true);

        subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(subscription);
    }

    public SubscriptionResponseDTO getSubscription(Long subscriptionId){
        if(subscriptionId == null){
            throw new IllegalArgumentException("Subscription id cannot be null");
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));
        return subscriptionMapper.toDTO(subscription);
    }

    public List<SubscriptionResponseDTO> getAllSubscriptions(){
        User currentUser = currentUserProvider.getLoggedInUser();

        return subscriptionRepository.findByUserId(currentUser.getId())
                .stream()
                .map(subscriptionMapper::toDTO)
                .toList();
    }

    public SubscriptionResponseDTO updateSubscription(Long id, SubscriptionRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

        if(dto.getCategoryId() != null){
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), currentUser.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            subscription.setCategory(category);
        }

        subscriptionMapper.updateEntityFromDTO(dto, subscription);
        subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }

    public SubscriptionResponseDTO deactivateSubscription(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));
        subscription.setActive(false);
        subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }

    public void deleteSubscription(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Subscription subscription = subscriptionRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));
        subscriptionRepository.delete(subscription);
    }
}