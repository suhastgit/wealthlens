import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { Asset } from '../../../../types';
import { APP_CONFIG } from '../../../../tokens';
import { formatAUD } from '../../../../utils';
import { Badge, Button } from '../../../../components';

@Component({
  selector: 'app-asset-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button],
  templateUrl: './asset-item.html',
})
export class AssetItem {
  private readonly config = inject(APP_CONFIG);

  readonly asset = input.required<Asset>();
  readonly edited = output<Asset>();
  readonly deleted = output<string>();

  protected formattedValue(): string {
    return formatAUD(this.asset().value, this.config);
  }
}
