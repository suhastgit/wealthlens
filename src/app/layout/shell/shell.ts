import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly theme = inject(ThemeService);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly updateAvailable = signal<boolean>(false);

  private readonly swUpdate = inject(SwUpdate, { optional: true });

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/assets', label: 'Assets', icon: '💰' },
    { path: '/liabilities', label: 'Liabilities', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  constructor() {
    if (this.swUpdate?.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(() => this.updateAvailable.set(true));
    }
  }

  protected applyUpdate(): void {
    window.location.reload();
  }
}
