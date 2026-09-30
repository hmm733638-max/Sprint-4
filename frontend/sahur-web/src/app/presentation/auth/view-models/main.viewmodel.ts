import { computed, Injectable } from '@angular/core';
import { SessionViewModel } from './session.viewmodel';

@Injectable()
export class MainViewModel {
  readonly user;
  readonly title = computed(() => {
    switch (this.user()?.role) {
      case 'Administrador': return 'Inicio de administración';
      case 'Auditor': return 'Inicio de auditoría';
      default: return 'Inicio de cliente';
    }
  });

  constructor(session: SessionViewModel) { this.user = session.user; }
}
