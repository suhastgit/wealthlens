import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';

@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="onBackdropClick($event)"
        (keydown.escape)="closed.emit()"
        tabindex="-1"
      >
        <div
          class="modal-panel"
          tabindex="0"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <div class="modal-header">
            <h2 class="modal-title">{{ title() }}</h2>
            <button
              class="modal-close"
              aria-label="Close modal"
              type="button"
              (click)="closed.emit()"
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
          @if (hasFooter()) {
            <div class="modal-footer">
              <ng-content select="[slot=footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        padding: 1rem;
        backdrop-filter: blur(2px);
      }
      .modal-panel {
        background: var(--color-surface);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        width: 100%;
        max-width: 34rem;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        background: var(--color-surface);
        z-index: 1;
      }
      .modal-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
        font-size: 1rem;
        padding: 0.375rem;
        border-radius: var(--radius-sm);
        transition:
          color 0.15s ease,
          background 0.15s ease;
        line-height: 1;
      }
      .modal-close:hover {
        color: var(--color-text-primary);
        background: var(--color-surface-raised);
      }
      .modal-body {
        padding: 1.5rem;
      }
      .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border);
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 0.75rem;
        position: sticky;
        bottom: 0;
        background: var(--color-surface);
      }
    `,
  ],
})
export class Modal {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');
  readonly hasFooter = input<boolean>(false);
  readonly closeOnBackdrop = input<boolean>(true);

  readonly closed = output<void>();

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
