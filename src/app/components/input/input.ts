import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  forwardRef,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInput),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper">
      @if (label()) {
        <label [for]="inputId()" class="input-label">
          {{ label() }}
          @if (required()) {
            <span class="input-required" aria-hidden="true">*</span>
          }
        </label>
      }
      <input
        [id]="inputId()"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [required]="required()"
        [attr.aria-describedby]="hint() ? inputId() + '-hint' : null"
        [attr.aria-invalid]="error() ? true : null"
        [class]="inputClasses()"
        [value]="internalValue()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      @if (hint() && !error()) {
        <p [id]="inputId() + '-hint'" class="input-hint">{{ hint() }}</p>
      }
      @if (error()) {
        <p class="input-error" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .input-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }
      .input-required {
        color: var(--color-danger);
        margin-left: 0.25rem;
      }
      .input-field {
        width: 100%;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        outline: none;
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }
      .input-field::placeholder {
        color: var(--color-text-muted);
      }
      .input-field:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
      }
      .input-field:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .input-field-error {
        border-color: var(--color-danger);
      }
      .input-field-error:focus {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 20%, transparent);
      }
      .input-hint {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .input-error {
        font-size: 0.75rem;
        color: var(--color-danger);
      }
    `,
  ],
})
export class AppInput implements ControlValueAccessor {
  readonly inputId = input<string>(`input-${Math.random().toString(36).slice(2, 7)}`);
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly value = input<string>('');

  readonly valueChange = output<string>();

  // internal signal that tracks the actual displayed value
  protected readonly internalValue = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  constructor() {
    // sync internalValue whenever the value input changes
    effect(() => {
      this.internalValue.set(this.value());
    });
  }

  protected inputClasses(): string {
    return `input-field${this.error() ? ' input-field-error' : ''}`;
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(value: string): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }
}
