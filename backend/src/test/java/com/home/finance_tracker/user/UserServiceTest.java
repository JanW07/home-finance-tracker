package com.home.finance_tracker.user;

import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.user.dto.UserRequestDTO;
import com.home.finance_tracker.user.dto.UserResponseDTO;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.user.mapper.UserMapper;
import com.home.finance_tracker.user.repository.UserRepository;
import com.home.finance_tracker.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setUsername("testuser");
        userRequestDTO.setEmail("test@example.com");

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setUsername("testuser");
        userResponseDTO.setEmail("test@example.com");
    }

    @Nested
    @DisplayName("createUser tests")
    class CreateUserTests {

        @Test
        @DisplayName("createUser - Happy Path")
        void createUser_Success() {
            when(userRepository.existsByUsername(userRequestDTO.getUsername())).thenReturn(false);
            when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
            when(userMapper.toEntity(userRequestDTO)).thenReturn(user);
            when(userRepository.save(user)).thenReturn(user);
            when(userMapper.toDTO(user)).thenReturn(userResponseDTO);

            UserResponseDTO result = userService.createUser(userRequestDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getUsername()).isEqualTo("testuser");

            verify(userRepository).save(user);
        }

        @Test
        @DisplayName("createUser - throws AppException when username is taken")
        void createUser_UsernameTaken_ThrowsException() {
            when(userRepository.existsByUsername(userRequestDTO.getUsername())).thenReturn(true);

            assertThatThrownBy(() -> userService.createUser(userRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.USER_USERNAME_TAKEN);

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("createUser - throws AppException when email is taken")
        void createUser_EmailTaken_ThrowsException() {
            when(userRepository.existsByUsername(userRequestDTO.getUsername())).thenReturn(false);
            when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(true);

            assertThatThrownBy(() -> userService.createUser(userRequestDTO))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.USER_EMAIL_TAKEN);

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("getUser tests")
    class GetUserTests {

        @Test
        @DisplayName("getUser - Happy Path")
        void getUser_Success() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userMapper.toDTO(user)).thenReturn(userResponseDTO);

            UserResponseDTO result = userService.getUser(1L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("getUser - throws AppException when ID is null")
        void getUser_NullId_ThrowsException() {
            assertThatThrownBy(() -> userService.getUser(null))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.INVALID_ID);
        }

        @Test
        @DisplayName("getUser - throws AppException when user not found")
        void getUser_UserNotFound_ThrowsException() {
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUser(1L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("getAllUsers tests")
    class GetAllUsersTests {

        @Test
        @DisplayName("getAllUsers - Happy Path")
        void getAllUsers_Success() {
            when(userRepository.findAll()).thenReturn(Collections.singletonList(user));
            when(userMapper.toDTO(user)).thenReturn(userResponseDTO);

            List<UserResponseDTO> result = userService.getAllUsers();

            assertThat(result).isNotNull().hasSize(1);
            assertThat(result.getFirst().getId()).isEqualTo(1L);
        }
    }

    @Nested
    @DisplayName("deleteUser tests")
    class DeleteUserTests {

        @Test
        @DisplayName("deleteUser - Happy Path")
        void deleteUser_Success() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));

            userService.deleteUser(1L);

            verify(userRepository).delete(user);
        }

        @Test
        @DisplayName("deleteUser - throws AppException when user not found")
        void deleteUser_UserNotFound_ThrowsException() {
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.deleteUser(1L))
                    .isInstanceOf(AppException.class)
                    .extracting("errorCode")
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);

            verify(userRepository, never()).delete(any());
        }
    }
}