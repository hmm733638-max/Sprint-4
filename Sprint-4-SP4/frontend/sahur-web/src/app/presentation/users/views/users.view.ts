import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersViewModel } from '../view-models/users.viewmodel';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [RouterLink],
  providers: [UsersViewModel],
  template: `
    <main>
      <a routerLink="/inicio">← Volver al inicio</a>
      <p class="eyebrow">AUDITORÍA</p><h1>Usuarios registrados</h1>
      <p class="intro">Directorio de cuentas registradas en SAHUR. Esta sección es solo de consulta.</p>
      @if (vm.loading()) { <div class="state" aria-live="polite" aria-busy="true"><span class="spinner"></span><strong>Cargando usuarios…</strong></div> }
      @else if (vm.error(); as error) { <div class="state error" role="alert"><strong>{{ error }}</strong><button type="button" (click)="vm.retry()">Reintentar</button></div> }
      @else { <div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo electrónico</th><th>Teléfono</th><th>Usuario</th><th>Rol</th></tr></thead><tbody>
        @for (user of vm.users(); track user.id) { <tr><td>{{ user.fullName }}</td><td>{{ user.email }}</td><td>{{ user.phone }}</td><td>{{ user.username }}</td><td>{{ user.role }}</td></tr> }
        @empty { <tr><td colspan="5">No hay usuarios registrados.</td></tr> }
      </tbody></table></div> }
    </main>`,
  styles: [`main{width:min(1040px,calc(100% - 40px));margin:auto;padding:52px 0}a{color:#006452;font-weight:800}.eyebrow{margin:28px 0 6px;color:#009d81;font-size:.78rem;font-weight:900;letter-spacing:.13em}h1{margin:0;color:#00245a;font-size:clamp(1.8rem,5vw,3rem)}.intro{color:#475569}.table-wrap{overflow:auto;background:#fff;border-radius:18px;box-shadow:0 12px 32px rgba(0,36,90,.09)}table{border-collapse:collapse;width:100%;min-width:720px}th,td{padding:16px;text-align:left;border-bottom:1px solid #e2e8f0}th{background:#00245a;color:#fff;font-size:.82rem}td{color:#334155}.state{min-height:240px;display:grid;place-items:center;align-content:center;gap:16px;border-radius:18px;background:#fff;color:#334155}.error{border:1px solid #fecaca;color:#991b1b}.state button{border:0;border-radius:999px;padding:10px 18px;background:#00245a;color:#fff;cursor:pointer;font-weight:800}.spinner{width:42px;height:42px;border:4px solid #dbe5ef;border-top-color:#009d81;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`]
})
export class UsersView implements OnInit {
  constructor(readonly vm: UsersViewModel) {}
  ngOnInit(): void { void this.vm.initialize(); }
}
