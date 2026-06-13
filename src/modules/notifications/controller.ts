import { notificationService } from './service';
import { createNotificationSchema } from './validation';
import { createdResponse, paginatedResponse } from '@shared/responses';
import { handleError } from '@core/middleware';
import { connectDatabase } from '@core/database';
import { validateSchema } from '@shared/utils/validation';
import { getPaginationParams } from '@shared/utils';
import type { JwtPayload } from '@shared/types';

export class NotificationController {
  async getAll(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const url = new URL(request.url);
      const { page, limit } = getPaginationParams(url);
      const { notifications, total } = await notificationService.getAll(page, limit);
      return paginatedResponse(notifications, total, page, limit);
    } catch (error) {
      return handleError(error);
    }
  }

  async create(request: Request, user: JwtPayload): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(createNotificationSchema, body);
      const notification = await notificationService.create({
        ...data,
        sentBy: user.userId,
      });
      return createdResponse(notification, 'Notification created');
    } catch (error) {
      return handleError(error);
    }
  }

  async createMass(request: Request, user: JwtPayload): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const { title, message, targetType, faculty, scheduledAt } = body;

      if (!title || !message || !targetType) {
        return new Response(
          JSON.stringify({ success: false, message: 'title, message y targetType son requeridos' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      let result: { queued: number };

      if (targetType === 'all') {
        result = await notificationService.sendToAll(title, message, user.userId, scheduledAt);
      } else if (targetType === 'faculty') {
        if (!faculty) {
          return new Response(
            JSON.stringify({ success: false, message: 'faculty es requerido para targetType=faculty' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
        result = await notificationService.sendToFaculty(faculty, title, message, user.userId, scheduledAt);
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'targetType inválido. Usa: all, faculty' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: result.queued + ' notificaciones encoladas', data: result }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ success: false, error: 'ID requerido' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const notification = await notificationService.delete(id);
      if (!notification) {
        return new Response(JSON.stringify({ success: false, error: 'Notificación no encontrada' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: true, message: 'Notificación eliminada' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return handleError(error);
    }
  }
}

export const notificationController = new NotificationController();