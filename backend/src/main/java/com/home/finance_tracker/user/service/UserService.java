package com.home.finance_tracker.user.service;

import com.home.finance_tracker.core.shared.infrastructure.exception.AppException;
import com.home.finance_tracker.core.shared.infrastructure.exception.ErrorCode;
import com.home.finance_tracker.user.dto.UserRequestDTO;
import com.home.finance_tracker.user.dto.UserResponseDTO;
import com.home.finance_tracker.user.entity.User;
import com.home.finance_tracker.user.mapper.UserMapper;
import com.home.finance_tracker.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    public UserResponseDTO createUser(UserRequestDTO dto){
        if(userRepository.existsByUsername(dto.getUsername())){
            throw new AppException(ErrorCode.USER_USERNAME_TAKEN);
        }
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new AppException(ErrorCode.USER_EMAIL_TAKEN);
        }

        User user = userMapper.toEntity(dto);
        userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public UserResponseDTO getUser(Long userId){
        if(userId == null){
            throw new AppException(ErrorCode.INVALID_ID);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toDTO(user);
    }

    public List<UserResponseDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .toList();
    }

    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }
}