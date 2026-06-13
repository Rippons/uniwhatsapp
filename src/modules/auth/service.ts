import { generateToken } from '@core/auth';
import { hashPassword, comparePassword } from '@core/auth';
import { UnauthorizedError, ConflictError } from '@shared/errors';
import { authRepository } from './repository';
import type { LoginInput, RegisterInput, AuthResponse } from './types';

export class AuthService {
  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await comparePassword(input.password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const userId = String(user._id);
    const token = generateToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: { id: userId, name: user.name, email: user.email, role: user.role },
    };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const exists = await authRepository.existsByEmail(input.email);
    if (exists) throw new ConflictError('Email already registered');

    const hashedPassword = await hashPassword(input.password);
    const user = await authRepository.create({ ...input, password: hashedPassword });

    const userId = String(user._id);
    const token = generateToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: { id: userId, name: user.name, email: user.email, role: user.role },
    };
  }
}

export const authService = new AuthService();
