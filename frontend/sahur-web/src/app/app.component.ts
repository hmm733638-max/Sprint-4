import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionViewModel } from './presentation/shared/view-models/session.viewmodel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [SessionViewModel],
  template: `
    @if (vm.user(); as user) {
      <header class="app-header">
        <strong class="app-brand">SAHUR</strong>

        <div class="session-summary">
          <span>{{ user.username }}</span>
          <span class="role-badge">{{ user.role }}</span>

          <button
            class="logout-button"
            type="button"
            [disabled]="vm.loading()"
            (click)="vm.logout()"
          >
            {{ vm.loading() ? 'Cerrando sesión…' : 'Cerrar sesión' }}
          </button>
        </div>

        @if (vm.error(); as message) {
          <p class="session-error" role="alert">{{ message }}</p>
        }
      </header>
    }

    <router-outlet />
  `
})
export class AppComponent {
  readonly vm = inject(SessionViewModel);
}
