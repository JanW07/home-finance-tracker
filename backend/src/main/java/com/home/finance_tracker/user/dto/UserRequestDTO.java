package com.home.finance_tracker.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    @NotNull
    private String username;
    @NotNull
    private String email;
    @NotNull
    private String password;
}
