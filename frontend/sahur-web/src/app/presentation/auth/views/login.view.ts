import { Component } from '@angular/core';
import { LoginViewModel } from '../view-models/login.viewmodel';

@Component({
  selector: 'app-login-view',
  standalone: true,
  providers: [LoginViewModel],
  template: `
    <main>
      <section class="login" aria-labelledby="login-title">
        <p class="brand">SAHUR</p>
        <h1 id="login-title">Bienvenido de nuevo</h1>
        <p class="intro">Inicia sesión con tu cuenta.</p>
        <form (submit)="submit($event)" [attr.aria-busy]="vm.loading()">
          <label for="username">Usuario</label>
          <input #usernameInput id="username" name="username" autocomplete="username" required
            [value]="vm.username()" (input)="vm.setUsername(usernameInput.value)" [disabled]="vm.loading()">
          <label for="password">Contraseña</label>
          <input #passwordInput id="password" name="password" type="password" autocomplete="current-password" required
            [value]="vm.password()" (input)="vm.setPassword(passwordInput.value)" [disabled]="vm.loading()">
          @if (vm.error()) { <p class="error" role="alert">{{ vm.error() }}</p> }
          <button type="submit" [disabled]="vm.loading()">
            {{ vm.loading() ? 'Ingresando…' : 'Iniciar sesión' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; }
    main { min-height: 100dvh; display: grid; place-items: center; padding: 24px; }
    .login { width: min(100%, 440px); padding: clamp(24px, 6vw, 40px); background: white;
      border-radius: 24px; box-shadow: 0 18px 50px rgba(0,36,90,.12); }
    .brand { color: #009d81; font-weight: 800; letter-spacing: .15em; margin: 0 0 28px; }
    h1 { color: #00245a; font-size: 1.85rem; margin: 0 0 12px; }
    .intro { color: #475569; margin: 0 0 28px; }
    form { display: grid; gap: 10px; }
    label { color: #00245a; font-weight: 600; }
    input { width: 100%; border: 1px solid #94a3b8; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
    input:focus-visible, button:focus-visible { outline: 3px solid #00245a; outline-offset: 3px; }
    button { margin-top: 8px; border: 0; border-radius: 10px; padding: 14px; background: #007d68;
      color: white; font-weight: 700; cursor: pointer; }
    button:disabled { opacity: .65; cursor: wait; }
    .error { margin: 0; padding: 12px; border-radius: 10px; color: #b42318; background: #fff1f0; }
  `]
})
export class LoginView {
  constructor(readonly vm: LoginViewModel) {}
  submit(event: Event): void {
    event.preventDefault();
    void this.vm.submit();
  }
}
