package com.home.finance_tracker.dto.request;

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
