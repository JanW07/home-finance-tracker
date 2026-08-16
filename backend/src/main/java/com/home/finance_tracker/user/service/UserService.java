package com.home.finance_tracker.user.service;

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
            throw new IllegalArgumentException("Username already taken");
        }
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new IllegalArgumentException("Email already registered");
        }

        User user = userMapper.toEntity(dto);
        userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public UserResponseDTO getUser(Long userId){
        if(userId == null){
            throw new IllegalArgumentException("User id cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
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
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
    }
}