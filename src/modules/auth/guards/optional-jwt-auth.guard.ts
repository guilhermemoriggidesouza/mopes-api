import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Igual ao JwtAuthGuard, mas não bloqueia quem não manda token:
 * com token válido preenche req.user; sem token segue com req.user = undefined.
 * Token presente mas inválido continua sendo recusado (401).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err) throw err;
    if (user) return user;
    if (!info || info.message === 'No auth token') return undefined;
    throw new UnauthorizedException();
  }
}
