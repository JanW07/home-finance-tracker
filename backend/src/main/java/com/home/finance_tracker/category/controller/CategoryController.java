package com.home.finance_tracker.category.controller;

import com.home.finance_tracker.category.dto.CategoryRequestDTO;
import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> addCategory(@Valid @RequestBody CategoryRequestDTO dto){
        CategoryResponseDTO category = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories(){
        List<CategoryResponseDTO> category = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id){
        CategoryResponseDTO category = categoryService.getCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequestDTO dto){
        CategoryResponseDTO category = categoryService.updateCategory(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
