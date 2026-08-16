package com.home.finance_tracker.category.mapper;

import com.home.finance_tracker.category.dto.CategoryRequestDTO;
import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.category.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryRequestDTO dto);

    CategoryResponseDTO toDTO(Category entity);

    void updateEntityFromDTO(CategoryRequestDTO dto, @MappingTarget Category category);
}
