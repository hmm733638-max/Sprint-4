import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoginViewModel } from '../view-models/login.viewmodel';

@Component({
  selector: 'app-login-view',
  standalone: true,
  providers: [LoginViewModel],
  templateUrl: './login.view.html',
  styleUrl: './login.view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginView {
  readonly vm = inject(LoginViewModel);
}
