import type { ParsedCommand } from './types';

export function parseCommand(text: string): ParsedCommand {
  const normalized = text.trim().toLowerCase();
  const parts = normalized.split(/\s+/);
  const command = parts[0] || '';
  const args = parts.slice(1);

  if (command === 'horario' && args[0] === 'hoy') {
    return { command: 'horario hoy', args: args.slice(1), raw: normalized };
  }

  return { command, args, raw: normalized };
}
