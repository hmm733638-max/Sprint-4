import { Inject, Injectable } from '@angular/core';
import {
  SESSION_REPOSITORY,
  SessionRepository
} from '../../repositories/session.repository';

@Injectable()
export class LogoutUseCase {

  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository
  ) {}

  execute(): void {
    this.sessionRepository.clear();
  }
}
