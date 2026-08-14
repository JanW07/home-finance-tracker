package com.home.finance_tracker.service;

import com.home.finance_tracker.dto.request.CategoryRequestDTO;
import com.home.finance_tracker.dto.response.CategoryResponseDTO;
import com.home.finance_tracker.entity.Category;
import com.home.finance_tracker.entity.User;
import com.home.finance_tracker.mapper.CategoryMapper;
import com.home.finance_tracker.repository.CategoryRepository;
import com.home.finance_tracker.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private CurrentUserProvider currentUserProvider;

    public CategoryResponseDTO createCategory(CategoryRequestDTO dto){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryMapper.toEntity(dto);
        category.setUser(currentUser);

        categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    public CategoryResponseDTO getCategory(Long categoryId){
        if(categoryId == null){
            throw new IllegalArgumentException("Category id cannot be null");
        }
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
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
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        categoryMapper.updateEntityFromDTO(dto, category);
        categoryRepository.save(category);

        return categoryMapper.toDTO(category);
    }

    public void deleteCategory(Long id){
        User currentUser = currentUserProvider.getLoggedInUser();

        Category category = categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        categoryRepository.delete(category);
    }
}