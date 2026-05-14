import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [type]="type()"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 500;
        border-radius: var(--radius-md);
        border: 1px solid transparent;
        cursor: pointer;
        transition:
          background 0.15s ease,
          opacity 0.15s ease;
        white-space: nowrap;
      }
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      }
      .btn-md {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
      .btn-lg {
        padding: 0.625rem 1.25rem;
        font-size: 1rem;
      }

      .btn-primary {
        background: var(--color-primary);
        color: #fff;
      }
      .btn-primary:hover:not(:disabled) {
        background: var(--color-primary-dark);
      }

      .btn-secondary {
        background: var(--color-surface-raised);
        color: var(--color-text-primary);
        border-color: var(--color-border);
      }
      .btn-secondary:hover:not(:disabled) {
        background: var(--color-border);
      }

      .btn-danger {
        background: var(--color-danger);
        color: #fff;
      }
      .btn-danger:hover:not(:disabled) {
        opacity: 0.85;
      }

      .btn-ghost {
        background: transparent;
        color: var(--color-text-secondary);
      }
      .btn-ghost:hover:not(:disabled) {
        background: var(--color-surface-raised);
      }
    `,
  ],
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string>('');

  readonly clicked = output<void>();

  protected buttonClasses(): string {
    return `btn btn-${this.variant()} btn-${this.size()}`;
  }
}
