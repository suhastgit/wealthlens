import { Component, ChangeDetectionStrategy, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Liability, LiabilityCategory } from '../../../../types';
import { Button, AppInput } from '../../../../components';

@Component({
  selector: 'app-liability-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, AppInput],
  templateUrl: './liability-form.html',
})
export class LiabilityForm implements OnInit {
  readonly liability = input<Liability | null>(null);
  readonly saved = output<Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>>();
  readonly cancelled = output<void>();

  readonly categories: LiabilityCategory[] = [
    'mortgage',
    'personal-loan',
    'car-loan',
    'credit-card',
    'hecs',
    'other',
  ];

  readonly name = signal<string>('');
  readonly category = signal<LiabilityCategory>('mortgage');
  readonly value = signal<string>('');
  readonly notes = signal<string>('');
  readonly error = signal<string>('');

  ngOnInit(): void {
    const existing = this.liability();
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
