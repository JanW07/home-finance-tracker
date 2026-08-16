package com.home.finance_tracker.category.service;

import com.home.finance_tracker.category.dto.CategoryRequestDTO;
import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.category.mapper.CategoryMapper;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private CategoryMapper categoryMapper;
    @Autowired private CurrentUserProvider currentUserProvider;
    @Autowired private List<CategoryUsageChecker> usageCheckers;

    public CategoryResponseDTO createCategory(CategoryRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryMapper.toEntity(dto);
        category.setUser(currentUser);

        categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    public CategoryResponseDTO getCategory(Long categoryId){
        if(categoryId == null){
            throw new AppException(ErrorCode.INVALID_ID);
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toDTO(category);
    }

    public List<CategoryResponseDTO> getAllCategories(){
        User currentUser = currentUserProvider.getLoggedInUser();

        return categoryRepository.findByUserId(currentUser.getId())
                .stream()
                .map(categoryMapper::toDTO)
                .toList();
    }

    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        categoryMapper.updateEntityFromDTO(dto, category);
        categoryRepository.save(category);

        return categoryMapper.toDTO(category);
    }

    public void deleteCategory(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        List<String> activeModules = usageCheckers.stream()
                .map(checker -> checker.checkUsage(id, currentUser.getId()))
                .filter(CategoryUsageResult::isUsed)
                .map(CategoryUsageResult::getModuleName)
                .collect(Collectors.toList());

        if (!activeModules.isEmpty()) {
            throw new AppException(ErrorCode.CATEGORY_IN_USE, String.join(", ", activeModules));
        }


        categoryRepository.delete(category);
    }
}