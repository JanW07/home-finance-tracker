package com.home.finance_tracker.mapper;

import com.home.finance_tracker.dto.request.SubscriptionRequestDTO;
import com.home.finance_tracker.dto.response.SubscriptionResponseDTO;
import com.home.finance_tracker.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    Subscription toEntity(SubscriptionRequestDTO dto);

    SubscriptionResponseDTO toDTO(Subscription entity);

    void updateEntityFromDTO(SubscriptionRequestDTO dto, @MappingTarget Subscription subscription);
}
