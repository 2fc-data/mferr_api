import { SetMetadata } from '@nestjs/common';

export const RULES_KEY = 'rules';
export const Rules = (...rules: string[]) => SetMetadata(RULES_KEY, rules);
