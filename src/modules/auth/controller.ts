import { authService } from './service';
import { loginSchema, registerSchema } from './validation';
import { successResponse } from '@shared/responses';
import { handleError } from '@core/middleware';
import { connectDatabase } from '@core/database';
import { validateSchema } from '@shared/utils/validation';

export class AuthController {
  async login(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(loginSchema, body);
      const result = await authService.login(data);
      return successResponse(result, 'Login successful');
    } catch (error) {
      return handleError(error);
    }
  }

  async register(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(registerSchema, body);
      const result = await authService.register(data);
      return successResponse(result, 'Registration successful', 201);
    } catch (error) {
      return handleError(error);
    }
  }
}

export const authController = new AuthController();
