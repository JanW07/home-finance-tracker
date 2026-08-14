package com.home.finance_tracker.security;

import com.home.finance_tracker.entity.User;
import com.home.finance_tracker.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {
    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getLoggedInUser(){ //todo fix after adding user creation
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
