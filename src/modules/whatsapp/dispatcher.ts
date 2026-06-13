import { WHATSAPP_COMMANDS } from '@shared/constants';
import { getTodayDayName } from '@shared/utils';
import { studentRepository } from '@modules/students/repository';
import { scheduleRepository } from '@modules/schedules/repository';
import type { ParsedCommand } from './types';

type CommandHandler = (phone: string, args: string[]) => Promise<string>;

const handlers: Record<string, CommandHandler> = {
  [WHATSAPP_COMMANDS.HORARIO]: async (phone) => {
    const student = await studentRepository.findByPhone(phone);
    if (!student) return 'No estás registrado en el sistema. Contacta a tu delegado.';

    const schedules = await scheduleRepository.findByStudentId(String(student._id));
    if (!schedules.length) return 'No tienes horarios registrados.';

    // Orden fijo de días: Lunes -> Sábado
    const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const DAYS_ES: Record<string, string> = {
      MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves', FRIDAY: 'Viernes', SATURDAY: 'Sábado',
    };

    // Ordenar por día según DAYS_ORDER y por hora de inicio
    schedules.sort((a, b) => {
      const ia = DAYS_ORDER.indexOf(a.day as any);
      const ib = DAYS_ORDER.indexOf(b.day as any);
      const pa = ia === -1 ? 999 : ia;
      const pb = ib === -1 ? 999 : ib;
      if (pa !== pb) return pa - pb;
      return a.startTime.localeCompare(b.startTime);
    });

    const grouped: Record<string, string[]> = {};
    for (const s of schedules) {
      if (!grouped[s.day]) grouped[s.day] = [];
      grouped[s.day].push(`  ${s.startTime}-${s.endTime} | ${s.subject} | ${s.classroom} | ${s.teacher}`);
    }

    let response = '*Tu horario completo:*\n';
    for (const dayKey of DAYS_ORDER) {
      const items = grouped[dayKey];
      if (!items || !items.length) continue;
      const dayLabel = DAYS_ES[dayKey] || dayKey;
      response += `\n*${dayLabel}*\n${items.join('\n')}`;
    }
    // Si hay días fuera de MON-SAT (p.ej. SUNDAY), añadirlos al final
    const extraDays = Object.keys(grouped).filter(d => !DAYS_ORDER.includes(d));
    for (const d of extraDays) {
      response += `\n*${d}*\n${grouped[d].join('\n')}`;
    }
    return response;
  },

  [WHATSAPP_COMMANDS.HORARIO_HOY]: async (phone) => {
    const student = await studentRepository.findByPhone(phone);
    if (!student) return 'No estás registrado en el sistema. Contacta a tu delegado.';

    const today = getTodayDayName();
    const DAYS_ES: Record<string, string> = {
      MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves', FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo',
    };
    const dayLabel = DAYS_ES[today] || today;

    const schedules = await scheduleRepository.findByStudentAndDay(String(student._id), today);
    if (!schedules.length) return `No tienes clases hoy (${dayLabel}).`;

    // Ordenar por hora de inicio
    schedules.sort((a, b) => a.startTime.localeCompare(b.startTime));

    let response = `*Horario de hoy (${dayLabel}):*\n`;
    for (const s of schedules) {
      response += `\n${s.startTime}-${s.endTime} | ${s.subject} | ${s.classroom}`;
    }
    return response;
  },

  [WHATSAPP_COMMANDS.MATERIAS]: async (phone) => {
    const student = await studentRepository.findByPhone(phone);
    if (!student) return 'No estás registrado en el sistema. Contacta a tu delegado.';

    const schedules = await scheduleRepository.findByStudentId(String(student._id));
    const subjects = [...new Set(schedules.map((s) => s.subject))];
    if (!subjects.length) return 'No tienes materias registradas.';

    return `*Tus materias:*\n${subjects.map((s) => `- ${s}`).join('\n')}`;
  },

  [WHATSAPP_COMMANDS.AYUDA]: async () => {
    return [
      '*Comandos disponibles:*',
      '',
      '*horario* - Ver tu horario completo',
      '*horario hoy* - Ver horario de hoy',
      '*materias* - Ver lista de materias',
      '*ayuda* - Ver este mensaje',
    ].join('\n');
  },
};

export async function dispatch(command: ParsedCommand, phone: string): Promise<string> {
  const handler = handlers[command.command];
  if (!handler) {
    return 'Comando no reconocido. Escribe *ayuda* para ver los comandos disponibles.';
  }
  return handler(phone, command.args);
}
