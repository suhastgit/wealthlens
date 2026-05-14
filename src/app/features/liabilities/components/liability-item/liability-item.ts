import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { Liability } from '../../../../types';
import { APP_CONFIG } from '../../../../tokens';
import { formatAUD } from '../../../../utils';
import { Badge, Button } from '../../../../components';

@Component({
  selector: 'app-liability-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button],
  templateUrl: './liability-item.html',
})
export class LiabilityItem {
  private readonly config = inject(APP_CONFIG);

  readonly liability = input.required<Liability>();
  readonly edited = output<Liability>();
  readonly deleted = output<string>();

  protected formattedValue(): string {
    return formatAUD(this.liability().value, this.config);
  }
}
