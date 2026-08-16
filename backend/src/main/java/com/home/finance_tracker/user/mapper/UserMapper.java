package com.home.finance_tracker.user.mapper;

import com.home.finance_tracker.user.dto.UserRequestDTO;
import com.home.finance_tracker.user.dto.UserResponseDTO;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.user.mapper.decorator.UserMapperDecorator;
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
