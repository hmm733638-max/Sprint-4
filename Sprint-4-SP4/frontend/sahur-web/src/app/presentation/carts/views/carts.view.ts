import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartsViewModel } from '../view-models/carts.viewmodel';

@Component({
  selector: 'app-carts-view', standalone: true, imports: [DatePipe, RouterLink], providers: [CartsViewModel],
  template: `
    <main><a routerLink="/inicio">← Volver al inicio</a><p class="eyebrow">AUDITORÍA</p><h1>Histórico global de carritos</h1><p class="intro">Consulta de operaciones registradas. No se pueden modificar ni eliminar carritos desde esta pantalla.</p>
    @if (vm.loading()) { <div class="state" aria-live="polite" aria-busy="true"><span class="spinner"></span><strong>Cargando carritos…</strong></div> }
    @else if (vm.error(); as error) { <div class="state error" role="alert"><strong>{{ error }}</strong><button type="button" (click)="vm.retry()">Reintentar</button></div> }
    @else { <section class="list">@for (cart of vm.carts(); track cart.id) { <article><button type="button" (click)="vm.toggle(cart.id)" [attr.aria-expanded]="vm.expandedCartId() === cart.id"><span><strong>Carrito #{{ cart.id }}</strong><small>Usuario #{{ cart.userId }}</small></span><time>{{ cart.createdOn | date:'longDate' }}</time><span>{{ vm.expandedCartId() === cart.id ? '−' : '+' }}</span></button>
      @if (vm.expandedCartId() === cart.id) { <div class="items"><h2>Artículos</h2><ul>@for (item of cart.products; track item.productId) { <li>Producto #{{ item.productId }} <strong>Cantidad: {{ item.quantity }}</strong></li> }</ul></div> }
    </article> } @empty { <div class="state"><strong>No hay carritos registrados.</strong></div> }</section> }
    </main>`,
  styles: [`main{width:min(900px,calc(100% - 40px));margin:auto;padding:52px 0}a{color:#006452;font-weight:800}.eyebrow{margin:28px 0 6px;color:#009d81;font-size:.78rem;font-weight:900;letter-spacing:.13em}h1{margin:0;color:#00245a;font-size:clamp(1.8rem,5vw,3rem)}.intro{color:#475569}.list{display:grid;gap:14px;margin-top:28px}article{background:#fff;border-radius:18px;box-shadow:0 12px 32px rgba(0,36,90,.09);overflow:hidden}article>button{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:center;width:100%;border:0;padding:20px;background:transparent;text-align:left;cursor:pointer;color:#00245a}small{display:block;margin-top:5px;color:#64748b;font-weight:700}time{color:#475569}.items{padding:0 20px 20px;border-top:1px solid #e2e8f0}.items h2{font-size:1rem;color:#00245a}.items ul{padding-left:20px;margin-bottom:0;color:#334155}.items li{padding:6px 0}.items strong{margin-left:12px}.state{min-height:240px;display:grid;place-items:center;align-content:center;gap:16px;border-radius:18px;background:#fff;color:#334155}.error{border:1px solid #fecaca;color:#991b1b}.state button{border:0;border-radius:999px;padding:10px 18px;background:#00245a;color:#fff;cursor:pointer;font-weight:800}.spinner{width:42px;height:42px;border:4px solid #dbe5ef;border-top-color:#009d81;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:560px){article>button{grid-template-columns:1fr auto}time{grid-column:1/-1;grid-row:2}.items strong{display:block;margin:4px 0 0}}`]
})
export class CartsView implements OnInit {
  constructor(readonly vm: CartsViewModel) {}
  ngOnInit(): void { void this.vm.initialize(); }
}
