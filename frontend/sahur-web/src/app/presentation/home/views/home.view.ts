import { Component, OnInit } from '@angular/core';
import { HomeViewModel } from '../view-models/home.viewmodel';

@Component({
  selector: 'app-home-view',
  standalone: true,
  providers: [HomeViewModel],
  template: `
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">SPRINT 4 · BASE COLABORATIVA</p>
        <h1>SAHUR</h1>
        <p class="lead">
          Angular MVVM estricto · .NET CQRS estricto · SOLID · EF Core InMemory
        </p>
      </section>

      <section class="panel">
        <div>
          <h2>Estado de la solución base</h2>
          <p>
            Este diagnóstico existe únicamente para comprobar el flujo completo
            entre frontend, backend y persistencia simulada.
          </p>
        </div>

        <button type="button" (click)="vm.loadStatus()" [disabled]="vm.loading()">
          {{ vm.loading() ? 'Verificando…' : 'Verificar backend' }}
        </button>

        @if (vm.status(); as status) {
          <dl class="status-grid">
            <div>
              <dt>Aplicación</dt>
              <dd>{{ status.application }}</dd>
            </div>
            <div>
              <dt>Persistencia</dt>
              <dd>{{ status.persistence }}</dd>
            </div>
            <div>
              <dt>Base disponible</dt>
              <dd>{{ status.databaseAvailable ? 'Sí' : 'No' }}</dd>
            </div>
          </dl>
        }

        @if (vm.error()) {
          <p class="error">{{ vm.error() }}</p>
        }
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .shell { width: min(1040px, calc(100% - 40px)); margin: 0 auto; padding: 72px 0; }
    .hero { margin-bottom: 32px; }
    .eyebrow { margin: 0 0 10px; font-weight: 800; letter-spacing: .14em; color: #009d81; }
    h1 { margin: 0; font-size: clamp(3rem, 9vw, 6.8rem); line-height: .9; color: #00245a; }
    .lead { max-width: 760px; font-size: 1.15rem; color: #475569; }
    .panel { background: #fff; border-radius: 24px; padding: 28px; box-shadow: 0 18px 50px rgba(0,36,90,.12); }
    .panel h2 { margin-top: 0; color: #00245a; }
    button { border: 0; border-radius: 999px; padding: 12px 20px; background: #009d81; color: #fff; font-weight: 800; cursor: pointer; }
    button:disabled { cursor: wait; opacity: .65; }
    .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 14px; margin: 24px 0 0; }
    .status-grid div { background: #f4f7fb; border-radius: 16px; padding: 16px; }
    dt { color: #64748b; font-size: .82rem; }
    dd { margin: 6px 0 0; color: #0f172a; font-weight: 800; overflow-wrap: anywhere; }
    .error { margin: 20px 0 0; color: #b42318; }
  `]
})
export class HomeView implements OnInit {
  constructor(readonly vm: HomeViewModel) {}

  ngOnInit(): void {
    void this.vm.loadStatus();
  }
}
