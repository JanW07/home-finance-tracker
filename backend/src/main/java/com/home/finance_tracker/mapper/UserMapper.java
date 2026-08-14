package com.home.finance_tracker.mapper;

import com.home.finance_tracker.dto.request.UserRequestDTO;
import com.home.finance_tracker.dto.response.UserResponseDTO;
import com.home.finance_tracker.entity.User;
import com.home.finance_tracker.mapper.decorator.UserMapperDecorator;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
@DecoratedWith(UserMapperDecorator.class)
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    User toEntity(UserRequestDTO dto);

    UserResponseDTO toDTO(User entity);
}
