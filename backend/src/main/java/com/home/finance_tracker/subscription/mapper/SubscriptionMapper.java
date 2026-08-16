package com.home.finance_tracker.subscription.mapper;

import com.home.finance_tracker.subscription.dto.SubscriptionRequestDTO;
import com.home.finance_tracker.subscription.dto.SubscriptionResponseDTO;
import com.home.finance_tracker.subscription.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    Subscription toEntity(SubscriptionRequestDTO dto);

    SubscriptionResponseDTO toDTO(Subscription entity);

    void updateEntityFromDTO(SubscriptionRequestDTO dto, @MappingTarget Subscription subscription);
}
