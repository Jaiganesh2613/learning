"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exception_interceptor_1 = require("./interceptors/exception.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('User Management API')
        .setDescription('This API handles user authentication, profile management, and role-based access.')
        .setVersion('1.0.0')
        .addServer('http://localhost:3004/', 'Local environment')
        .addServer('https://staging.myapp.com/', 'Staging')
        .addServer('https://api.myapp.com/', 'Production')
        .addTag('Users')
        .addTag('Authentication')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new exception_interceptor_1.GlobalExceptionFilter());
    await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
//# sourceMappingURL=main.js.map