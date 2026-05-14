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
