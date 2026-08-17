package com.home.finance_tracker.category.service;

import com.home.finance_tracker.category.dto.CategoryRequestDTO;
import com.home.finance_tracker.category.dto.CategoryResponseDTO;
import com.home.finance_tracker.category.entity.Category;
import com.home.finance_tracker.category.mapper.CategoryMapper;
import com.home.finance_tracker.category.repository.CategoryRepository;
import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.core.shared.infrastructure.security.CurrentUserProvider;
import com.home.finance_tracker.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Spy
    private List<CategoryUsageChecker> usageCheckers = new ArrayList<>();

    @InjectMocks
    private CategoryService categoryService;

    private User currentUser;
    private Category category;
    private CategoryRequestDTO categoryRequestDTO;
    private CategoryResponseDTO categoryResponseDTO;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);

        category = new Category();
        category.setId(10L);

        categoryRequestDTO = new CategoryRequestDTO();
        categoryResponseDTO = new CategoryResponseDTO();
        categoryResponseDTO.setId(10L);

        lenient().when(currentUserProvider.getLoggedInUser()).thenReturn(currentUser);
    }

    @Nested
    @DisplayName("createCategory tests")
    class CreateCategoryTests {

        @Test
        @DisplayName("createCategory - Happy Path")
        void createCategory_Success() {
            when(categoryMapper.toEntity(categoryRequestDTO)).thenReturn(category);
            when(categoryRepository.save(category)).thenReturn(category);
            when(categoryMapper.toDTO(category)).thenReturn(categoryResponseDTO);

            CategoryResponseDTO result = categoryService.createCategory(categoryRequestDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(10L);
            assertThat(category.getUser()).isEqualTo(currentUser);

            verify(categoryRepository).save(category);
        }
    }

    @Nested
    @DisplayName("getCategory tests")
    class GetCategoryTests {

        @Test
        @DisplayName("getCategory - Happy Path")
        void getCategory_Success() {
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(categoryMapper.toDTO(category)).thenReturn(categoryResponseDTO);

            CategoryResponseDTO result = categoryService.getCategory(10L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(10L);
        }

        @Test
        @DisplayName("getCategory - throws AppException when ID is null")
        void getCategory_NullId_ThrowsException() {
            assertThatThrownBy(() -> categoryService.getCategory(null))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.INVALID_ID);
        }

        @Test
        @DisplayName("getCategory - throws AppException when category not found")
        void getCategory_NotFound_ThrowsException() {
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> categoryService.getCategory(10L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("getAllCategories tests")
    class GetAllCategoriesTests {

        @Test
        @DisplayName("getAllCategories - Happy Path")
        void getAllCategories_Success() {
            when(categoryRepository.findByUserId(currentUser.getId()))
                    .thenReturn(Collections.singletonList(category));
            when(categoryMapper.toDTO(category)).thenReturn(categoryResponseDTO);

            List<CategoryResponseDTO> result = categoryService.getAllCategories();

            assertThat(result).isNotNull().hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(10L);
        }
    }

    @Nested
    @DisplayName("updateCategory tests")
    class UpdateCategoryTests {

        @Test
        @DisplayName("updateCategory - Happy Path")
        void updateCategory_Success() {
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));
            when(categoryRepository.save(category)).thenReturn(category);
            when(categoryMapper.toDTO(category)).thenReturn(categoryResponseDTO);

            CategoryResponseDTO result = categoryService.updateCategory(10L, categoryRequestDTO);

            assertThat(result).isNotNull();
            verify(categoryMapper).updateEntityFromDTO(categoryRequestDTO, category);
            verify(categoryRepository).save(category);
        }

        @Test
        @DisplayName("updateCategory - throws AppException when category not found")
        void updateCategory_NotFound_ThrowsException() {
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> categoryService.updateCategory(10L, categoryRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(categoryRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("deleteCategory tests")
    class DeleteCategoryTests {

        @Test
        @DisplayName("deleteCategory - Happy Path when category is not in use")
        void deleteCategory_Success() {
            CategoryUsageChecker checkerMock = mock(CategoryUsageChecker.class);
            CategoryUsageResult unusedResult = mock(CategoryUsageResult.class);

            when(unusedResult.isUsed()).thenReturn(false);
            when(checkerMock.checkUsage(10L, currentUser.getId())).thenReturn(unusedResult);
            usageCheckers.add(checkerMock);

            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));

            categoryService.deleteCategory(10L);

            verify(categoryRepository).delete(category);
        }

        @Test
        @DisplayName("deleteCategory - throws AppException when category is in use")
        void deleteCategory_CategoryInUse_ThrowsException() {
            CategoryUsageChecker checkerMock = mock(CategoryUsageChecker.class);
            CategoryUsageResult usedResult = mock(CategoryUsageResult.class);

            when(usedResult.isUsed()).thenReturn(true);
            when(usedResult.getModuleName()).thenReturn("TRANSACTIONS");
            when(checkerMock.checkUsage(10L, currentUser.getId())).thenReturn(usedResult);
            usageCheckers.add(checkerMock);

            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.of(category));

            assertThatThrownBy(() -> categoryService.deleteCategory(10L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_IN_USE);

            verify(categoryRepository, never()).delete(any());
        }

        @Test
        @DisplayName("deleteCategory - throws AppException when category not found")
        void deleteCategory_NotFound_ThrowsException() {
            when(categoryRepository.findByIdAndUserId(10L, currentUser.getId()))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> categoryService.deleteCategory(10L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);

            verify(categoryRepository, never()).delete(any());
        }
    }
}