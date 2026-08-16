package com.home.finance_tracker.core.shared.infrastructure.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // COMMON
    INVALID_ID("common.error.invalid_id", HttpStatus.BAD_REQUEST),

    // CATEGORY
    CATEGORY_NOT_FOUND("category.error.not_found", HttpStatus.NOT_FOUND),
    CATEGORY_IN_USE("category.error.in_use", HttpStatus.CONFLICT),

    // EXPENSE
    EXPENSE_NOT_FOUND("expense.error.not_found", HttpStatus.NOT_FOUND),

    // SUBSCRIPTION
    SUBSCRIPTION_NOT_FOUND("subscription.error.not_found", HttpStatus.NOT_FOUND),

    // SUBSCRIPTION
    TRANSACTION_NOT_FOUND("transaction.error.not_found", HttpStatus.NOT_FOUND),

    // USER
    USER_NOT_FOUND("user.error.not_found", HttpStatus.NOT_FOUND),
    USER_USERNAME_TAKEN("user.error.username_taken", HttpStatus.CONFLICT),
    USER_EMAIL_TAKEN("user.error.email_taken", HttpStatus.CONFLICT);

    private final String messageKey;
    private final HttpStatus status;
}