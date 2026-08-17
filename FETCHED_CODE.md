### `frontend\src\components\common\common.css`
```
/* Nagłówek strony (używany przez wszystkie widoki listowe) */
.page-header {
  margin-bottom: 0.5rem;
}

.page-header h1 {
  font-family: var(--font-heading);
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .page-header-row {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Pole formularza */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Input i Select */
.form-input,
.form-select {
  padding: 0.7rem 0.95rem;
  font-size: 0.95rem;
  font-family: var(--font-body);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:hover,
.form-select:hover {
  border-color: var(--border-color-strong);
}

.form-input:focus,
.form-select:focus {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-focus);
  background-color: var(--bg-card);
}

.form-input.is-invalid,
.form-select.is-invalid {
  border-color: var(--color-expense);
}

.field-error {
  font-size: 0.78rem;
  color: var(--color-expense);
}

/* FormCard */
.form-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  box-shadow: var(--shadow-card);
}

.form-card-title {
  margin: 0 0 1.4rem 0;
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.form-card-content {
  display: flex;
  flex-direction: column;
}

/* Przyciski */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-sm { padding: 0.45rem 0.85rem; font-size: 0.85rem; border-radius: var(--radius-sm); }
.btn-md { padding: 0.7rem 1.35rem; font-size: 0.95rem; }
.btn-lg { padding: 0.85rem 1.65rem; font-size: 1.05rem; }

.btn-primary {
  background-color: var(--accent-color);
  color: var(--on-accent);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-card-hover);
}

.btn-danger {
  background-color: var(--color-expense-bg);
  color: var(--color-expense);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-expense);
  color: #ffffff;
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.btn-icon {
  padding: 0.5rem;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

.form-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

/* Layout list/page dla sekcji CRUD (kategorie, wydatki, subskrypcje) */
.list-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 720px;
}

.error-message {
  color: var(--color-expense);
  font-size: 0.9rem;
}

.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.85rem;
}

.item-card {
  display: flex;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.9rem 1.1rem;
  gap: 0.85rem;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.item-card:hover {
  border-color: var(--border-color-strong);
  transform: translateY(-1px);
}

.item-icon {
  font-size: 1.2rem;
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  line-height: 1;
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.item-title {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.item-actions {
  display: flex;
  gap: 0.4rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  line-height: 1;
}

.badge-neutral {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.badge-accent {
  background-color: rgba(245, 166, 35, 0.16);
  color: var(--accent-color);
}

.badge-income {
  background-color: var(--color-income-bg);
  color: var(--color-income);
}

.badge-expense {
  background-color: var(--color-expense-bg);
  color: var(--color-expense);
}

```

### `frontend\src\components\common\TransactionTypeToggle.css`
```
.type-segmented {
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px;
  gap: 4px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-sizing: border-box;
}

.type-segmented-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 10px;
  background: var(--color-expense, #e5484d);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.22s ease;
}

.type-segmented.is-income .type-segmented-thumb {
  transform: translateX(100%);
  background: var(--color-income, #1fb579);
}

.type-segmented-option {
  position: relative;
  z-index: 1;
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.type-segmented-option:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.type-segmented-option.active {
  color: #fff;
}

.type-segmented-option:not(.active):hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 480px) {
  .type-segmented-option {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
}
```

### `frontend\src\features\dashboard\SummaryCard.css`
```
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--accent-color);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.5rem;
  box-shadow: var(--shadow-card);
}

.summary-card-positive { border-left-color: var(--color-income); }
.summary-card-negative { border-left-color: var(--color-expense); }

.summary-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-card-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.summary-card-icon {
  font-size: 1.3rem;
  line-height: 1;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-card-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 1.65rem;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-card-trend {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.trend-up { color: var(--color-income); }
.trend-down { color: var(--color-expense); }
.trend-flat { color: var(--text-secondary); }

.summary-card-trend-label {
  color: var(--text-secondary);
  font-weight: 400;
}

.summary-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

```

### `frontend\src\pages\homePage\HomePage.css`
```
.home-title {
  color: var(--text-primary);
  font-size: 1.9rem;
  margin-bottom: 0.4rem;
}

.home-subtitle {
  color: var(--text-secondary);
  margin-top: 0;
  font-size: 0.98rem;
}

.nav-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 2.25rem;
  width: 100%;
}

.nav-card {
  text-decoration: none;
  color: inherit;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.nav-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-3px);
}

.nav-card-icon {
  font-size: 1.9rem;
  margin-bottom: 0.9rem;
  line-height: 1;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-card-title {
  margin: 0 0 0.5rem 0;
  font-family: var(--font-heading);
  color: var(--text-primary);
  font-size: 1.15rem;
}

.nav-card-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

```

### `frontend\src\pages\transactions\transactions.css`
```
.summary-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.transaction-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.transaction-day-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 4px 8px;
  border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
  margin-bottom: 10px;
}

.transaction-day-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted, #9a9ab5);
}

.transaction-day-total {
  font-size: 0.85rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.transaction-card {
  border-left: 3px solid transparent;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.transaction-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.transaction-card-income { border-left-color: var(--color-income, #34d399); }
.transaction-card-expense { border-left-color: var(--color-expense, #f87171); }

.transaction-icon-bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 12px;
  font-size: 1.1rem;
}

.bubble-income { background: color-mix(in srgb, var(--color-income, #34d399) 18%, transparent); }
.bubble-expense { background: color-mix(in srgb, var(--color-expense, #f87171) 18%, transparent); }

.transaction-amount-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-left: auto;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.text-income { color: var(--color-income, #34d399); }
.text-expense { color: var(--color-expense, #f87171); }

.amount-type-card {
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color 0.2s ease;
}

.amount-type-card.is-expense {
  border-color: rgba(229, 72, 77, 0.35);
}

.amount-type-card.is-income {
  border-color: rgba(31, 181, 121, 0.35);
}

.amount-hero-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}

.amount-hero-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.amount-hero-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.amount-hero-sign {
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.amount-hero-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 2.75rem;
  font-weight: 700;
  color: #fff;
  max-width: 220px;
  text-align: left;
}

.amount-hero-input::-webkit-outer-spin-button,
.amount-hero-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-type-card.is-expense .amount-hero-input,
.amount-type-card.is-expense .amount-hero-sign {
  color: var(--color-expense, #e5484d);
}

.amount-type-card.is-income .amount-hero-input,
.amount-type-card.is-income .amount-hero-sign {
  color: var(--color-income, #1fb579);
}

.amount-hero-currency {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  width: 52px;
  text-align: center;
  align-self: center;
}

.category-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  background: var(--color-bg-elevated, rgba(255, 255, 255, 0.04));
  color: var(--color-text, #f4f4f8);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease;
}

.category-chip:hover { border-color: var(--color-accent, #f5a623); }

.category-chip.active {
  border-color: var(--color-accent, #f5a623);
  background: color-mix(in srgb, var(--color-accent, #f5a623) 16%, transparent);
}

.date-field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-field-row .form-input { flex: 1; }

.chip-btn {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  background: transparent;
  color: var(--color-text-muted, #9a9ab5);
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.chip-btn.active {
  border-color: var(--color-accent, #f5a623);
  color: var(--color-accent, #f5a623);
}

.subscription-toggle-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 18px;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.switch { position: relative; display: inline-block; }
.switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.switch-track {
  display: block;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--color-bg-elevated, rgba(255, 255, 255, 0.12));
  transition: background 0.15s ease;
  position: relative;
}
.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s ease;
}
.switch input:checked + .switch-track { background: var(--color-accent, #f5a623); }
.switch input:checked + .switch-track .switch-thumb { transform: translateX(16px); }

.billing-period-toggle { display: flex; gap: 6px; }

.period-chip {
  flex: 1;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  background: transparent;
  color: var(--color-text-muted, #9a9ab5);
  font-size: 0.8rem;
  cursor: pointer;
}

.period-chip.active {
  border-color: var(--color-accent, #f5a623);
  background: color-mix(in srgb, var(--color-accent, #f5a623) 16%, transparent);
  color: var(--color-accent, #f5a623);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 48px 16px;
  text-align: center;
  color: var(--color-text-muted, #9a9ab5);
}

.empty-state-icon { font-size: 2rem; }
.empty-state-title { font-size: 1rem; font-weight: 600; color: var(--color-text, #f4f4f8); }
.empty-state-hint { font-size: 0.85rem; }
```