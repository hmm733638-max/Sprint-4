import { Component } from '@angular/core';
import { MainViewModel } from '../view-models/main.viewmodel';

@Component({
  selector: 'app-main-view',
  standalone: true,
  providers: [MainViewModel],
  template: `
    <main>
      <p class="brand">SAHUR</p>

      @if (vm.user(); as user) {
        <header>
          <h1>Hola, {{ user.username }}</h1>
          <span>{{ user.role }}</span>

          <button type="button" (click)="vm.logout()">
            Cerrar sesión
          </button>
        </header>

        <section>
          <h2>{{ vm.title() }}</h2>
          <p>Tu sesión está activa.</p>
        </section>
      }
    </main>
  `,
  styles: [`
    main {
      width: min(1040px, calc(100% - 40px));
      margin: auto;
      padding: 64px 0;
    }

    .brand {
      color: #009d81;
      font-weight: 800;
      letter-spacing: .15em;
    }

    header {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin: 28px 0;
    }

    h1 {
      color: #00245a;
      font-size: clamp(1.8rem, 5vw, 3rem);
      margin: 0;
      overflow-wrap: anywhere;
    }

    span {
      border-radius: 999px;
      background: #d8f5ed;
      color: #005748;
      padding: 8px 14px;
      font-weight: 700;
    }

    button {
      margin-left: auto;
      border: 0;
      border-radius: 12px;
      padding: 10px 18px;
      cursor: pointer;
      font-weight: 700;
    }

    section {
      padding: 28px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 18px 50px rgba(0,36,90,.1);
    }

    h2 {
      color: #00245a;
      margin-top: 0;
    }

    p {
      color: #475569;
    }
  `]
})
export class MainView {
  constructor(readonly vm: MainViewModel) {}
}
