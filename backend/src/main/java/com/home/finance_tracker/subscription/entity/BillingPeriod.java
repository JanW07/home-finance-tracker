package com.home.finance_tracker.subscription.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.Period;

@AllArgsConstructor
@Getter
public enum BillingPeriod {
    WEEKLY(Period.ofWeeks(1)),
    MONTHLY(Period.ofMonths(1)),
    YEARLY(Period.ofYears(1));

    private final Period period;

    public LocalDate nextDateFrom(LocalDate startDate) {
        return startDate.plus(this.period);
    }
}
