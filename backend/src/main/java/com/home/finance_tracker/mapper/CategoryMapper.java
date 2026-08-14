package com.home.finance_tracker.mapper;

import com.home.finance_tracker.dto.request.CategoryRequestDTO;
import com.home.finance_tracker.dto.response.CategoryResponseDTO;
import com.home.finance_tracker.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryRequestDTO dto);

    CategoryResponseDTO toDTO(Category entity);

    void updateEntityFromDTO(CategoryRequestDTO dto, @MappingTarget Category category);
}
