package com.home.finance_tracker.mapper.decorator;

import com.home.finance_tracker.dto.request.UserRequestDTO;
import com.home.finance_tracker.entity.User;
import com.home.finance_tracker.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

public abstract class UserMapperDecorator implements UserMapper {

    @Autowired
    @Qualifier("delegate")
    private UserMapper delegate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User toEntity(UserRequestDTO dto){
        if(dto == null){
            return null;
        }

        User user = delegate.toEntity(dto);

        if(dto.getPassword() != null){
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        return user;
    }
}
