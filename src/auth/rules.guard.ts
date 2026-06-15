import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RULES_KEY } from './rules.decorator';

@Injectable()
export class RulesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRules = this.reflector.getAllAndOverride<string[]>(
      RULES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRules) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // If no user is attached (e.g. no AuthGuard ran before), deny or allow?
    // For now, if no user, deny.
    if (!user || !user.rules) {
      console.warn(
        'RulesGuard: No user or rules found on request. ensure AuthGuard is running.',
      );
      return false; // Strict by default
    }

    return requiredRules.some((rule) => user.rules?.includes(rule));
  }
}
