export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'UniWhatsApp API',
    version: '1.0.0',
    description: 'API de Gestión Universitaria Integrada con WhatsApp',
  },
  servers: [
    {
      url: 'http://localhost:4321',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      Student: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          fullName: { type: 'string' },
          phone: { type: 'string' },
          code: { type: 'string' },
          faculty: { type: 'string' },
          semester: { type: 'integer' },
          active: { type: 'boolean' },
        },
      },
      Schedule: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          studentId: { type: 'string' },
          subject: { type: 'string' },
          classroom: { type: 'string' },
          teacher: { type: 'string' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          day: {
            type: 'string',
            enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
          },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          targetStudents: { type: 'array', items: { type: 'string' } },
          scheduledAt: { type: 'string', format: 'date-time', nullable: true },
          status: { type: 'string', enum: ['PENDING', 'SCHEDULED', 'SENT', 'FAILED'] },
          sentAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: { '200': { description: 'Login successful' } },
      },
    },
    '/api/students': {
      get: {
        tags: ['Students'],
        summary: 'List students',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'faculty', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Students list' } },
      },
      post: {
        tags: ['Students'],
        summary: 'Create student',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Student' } } },
        },
        responses: { '201': { description: 'Student created' } },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get student by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Student data' } },
      },
      put: {
        tags: ['Students'],
        summary: 'Update student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Student updated' } },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Student deleted' } },
      },
    },
    '/api/schedules': {
      post: {
        tags: ['Schedules'],
        summary: 'Create schedule',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Schedule' } } },
        },
        responses: { '201': { description: 'Schedule created' } },
      },
    },
    '/api/schedules/student/{id}': {
      get: {
        tags: ['Schedules'],
        summary: 'Get schedules by student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Student schedules' } },
      },
    },
    '/api/schedules/today/{studentId}': {
      get: {
        tags: ['Schedules'],
        summary: 'Get today schedules for student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Today schedules' } },
      },
    },
    '/api/schedules/{id}': {
      put: {
        tags: ['Schedules'],
        summary: 'Update schedule',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Schedule updated' } },
      },
      delete: {
        tags: ['Schedules'],
        summary: 'Delete schedule',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Schedule deleted' } },
      },
    },
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List notifications',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Notifications list' } },
      },
      post: {
        tags: ['Notifications'],
        summary: 'Create notification',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Notification' } } },
        },
        responses: { '201': { description: 'Notification created' } },
      },
    },
    '/api/whatsapp/webhook': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Verify webhook',
        parameters: [
          { name: 'hub.mode', in: 'query', schema: { type: 'string' } },
          { name: 'hub.verify_token', in: 'query', schema: { type: 'string' } },
          { name: 'hub.challenge', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Challenge response' } },
      },
      post: {
        tags: ['WhatsApp'],
        summary: 'Receive webhook',
        responses: { '200': { description: 'Processed' } },
      },
    },
  },
};
