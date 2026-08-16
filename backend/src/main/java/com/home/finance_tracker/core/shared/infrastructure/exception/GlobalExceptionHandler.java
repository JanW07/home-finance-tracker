package com.home.finance_tracker.core.shared.infrastructure.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Locale;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired private MessageSource messageSource;

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            AppException ex,
            HttpServletRequest request
    ) {
        Locale locale = LocaleContextHolder.getLocale();
        ErrorCode errorCode = ex.getErrorCode();

        String localizedMessage = messageSource.getMessage(
                errorCode.getMessageKey(),
                ex.getArgs(),
                locale
        );
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                errorCode.getStatus().value(),
                errorCode.getStatus().getReasonPhrase(),
                localizedMessage,
                request.getRequestURI()
        );

        return new ResponseEntity<>(errorResponse, errorCode.getStatus());
    }
}
