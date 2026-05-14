import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses()">
      <ng-content />
    </span>
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1;
      }
      .badge-success {
        background: color-mix(in srgb, var(--color-success) 15%, transparent);
        color: var(--color-success);
      }
      .badge-danger {
        background: color-mix(in srgb, var(--color-danger) 15%, transparent);
        color: var(--color-danger);
      }
      .badge-warning {
        background: color-mix(in srgb, var(--color-warning) 15%, transparent);
        color: var(--color-warning);
      }
      .badge-info {
        background: color-mix(in srgb, var(--color-primary) 15%, transparent);
        color: var(--color-primary);
      }
      .badge-neutral {
        background: var(--color-surface-raised);
        color: var(--color-text-secondary);
      }
    `,
  ],
})
export class Badge {
  readonly variant = input<BadgeVariant>('neutral');

  protected badgeClasses(): string {
    return `badge badge-${this.variant()}`;
  }
}
