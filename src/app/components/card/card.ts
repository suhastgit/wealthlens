import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()">
      @if (title()) {
        <div class="card-header">
          <h3 class="card-title">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="card-subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
        margin: 5px;
      }
      .card-raised {
        background: var(--color-surface-raised);
        box-shadow: var(--shadow-md);
      }
      .card-header {
        padding: 1.25rem 1.5rem 0;
      }
      .card-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      .card-subtitle {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-top: 0.25rem;
      }
      .card-body {
        padding: 1.25rem 1.5rem;
      }
    `,
  ],
})
export class Card {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly raised = input<boolean>(false);

  protected cardClasses(): string {
    return this.raised() ? 'card card-raised' : 'card';
  }
}
