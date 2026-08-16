package com.home.finance_tracker.category.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDTO {
    @NonNull
    private String name;
    private String icon;
}
