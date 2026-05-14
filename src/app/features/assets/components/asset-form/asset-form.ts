import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Asset, AssetCategory } from '../../../../types';
import { APP_CONFIG } from '../../../../tokens';
import { Button, AppInput } from '../../../../components';

@Component({
  selector: 'app-asset-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, AppInput],
  templateUrl: './asset-form.html',
  styles: [
    `
      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .form-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }
      .form-select {
        width: 100%;
        height: 2.375rem;
        padding: 0 2.25rem 0 0.75rem;
        font-size: 0.875rem;
        font-family: inherit;
        color: var(--color-text-primary);
        background-color: var(--color-surface);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.625rem center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }
      .form-select:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
      }
      .form-select:hover:not(:focus) {
        border-color: var(--color-text-muted);
      }
      .form-error {
        font-size: 0.75rem;
        color: var(--color-danger);
      }
      .form-actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--color-border);
      }
    `,
  ],
})
export class AssetForm implements OnInit {
  private readonly config = inject(APP_CONFIG);

  readonly asset = input<Asset | null>(null);
  readonly saved = output<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>();
  readonly cancelled = output<void>();

  readonly categories: AssetCategory[] = [
    'property',
    'savings',
    'superannuation',
    'vehicle',
    'investment',
    'other',
  ];

  readonly name = signal<string>('');
  readonly category = signal<AssetCategory>('savings');
  readonly value = signal<string>('');
  readonly notes = signal<string>('');
  readonly error = signal<string>('');

  ngOnInit(): void {
    const existing = this.asset();
    if (existing) {
      this.name.set(existing.name);
      this.category.set(existing.category);
      this.value.set(existing.value.toString());
      this.notes.set(existing.notes ?? '');
    }
  }

  protected onSubmit(): void {
    const name = this.name().trim();
    const value = parseFloat(this.value());

    if (!name) {
      this.error.set('Name is required.');
      return;
    }
    if (isNaN(value) || value < 0) {
      this.error.set('Please enter a valid positive value.');
      return;
    }

    this.error.set('');
    this.saved.emit({
      name,
      category: this.category(),
      value,
      notes: this.notes().trim() || undefined,
    });
  }
}
