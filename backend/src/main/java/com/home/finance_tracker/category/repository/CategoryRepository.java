package com.home.finance_tracker.category.repository;

import com.home.finance_tracker.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    List<Category> findByUserId(Long userId);
}
