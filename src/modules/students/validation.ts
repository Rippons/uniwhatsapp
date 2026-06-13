import { z } from 'zod/v4';

// Teléfonos colombianos:
// - Celular: 10 dígitos, empieza en 3 (ej: 3101234567)
// - Fijo Bogotá: 7 dígitos, empieza en 1-8 (ej: 6012345678 con indicativo)
// - Con indicativo internacional: +573101234567 o 573101234567
const colombianPhoneRegex = /^([+]?57)?3[0-9]{9}$/;

function normalizePhone(phone: string): string {
  // Eliminar espacios, guiones y paréntesis
  const cleaned = phone.replace(/[\s-().]/g, '');
  // Quitar prefijo +57 o 57 si viene con él
  if (cleaned.startsWith('+57')) return cleaned.slice(3);
  if (cleaned.startsWith('57') && cleaned.length === 12) return cleaned.slice(2);
  return cleaned;
}

const phoneSchema = z
  .string()
  .transform((val) => normalizePhone(val))
  .refine((val) => colombianPhoneRegex.test(val) || /^3[0-9]{9}$/.test(val), {
    message: 'Teléfono inválido. Debe ser un celular colombiano (ej: 3101234567)',
  });

export const createStudentSchema = z.object({
  fullName: z.string().min(2).max(150),
  phone: phoneSchema,
  code: z
    .string()
    .min(6)
    .max(15)
    .refine((val) => /^[0-9]+$/.test(val), {
      message: 'El código debe contener solo números (cédula colombiana)',
    }),
  faculty: z.enum([
    'Ingenieria de software',
    'Diseño grafico',
    'Finanzas y comercio',
    'Diseño de modas',
    'Hoteleria y turismo',
  ]),
  semester: z.number().int().min(1).max(12),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2).max(150).optional(),
  phone: phoneSchema.optional(),
  faculty: z
    .enum([
      'Ingenieria de software',
      'Diseño grafico',
      'Finanzas y comercio',
      'Diseño de modas',
      'Hoteleria y turismo',
    ])
    .optional(),
  semester: z.number().int().min(1).max(12).optional(),
  active: z.boolean().optional(),
});