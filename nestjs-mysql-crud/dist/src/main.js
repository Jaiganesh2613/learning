"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exception_interceptor_1 = require("./interceptors/exception.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new exception_interceptor_1.GlobalExceptionFilter());
    await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
//# sourceMappingURL=main.js.map