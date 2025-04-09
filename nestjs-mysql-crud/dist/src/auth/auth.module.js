"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/user.entity");
const auth_guard_1 = require("./auth.guard");
const core_1 = require("@nestjs/core");
const constants_1 = require("./constants");
const user_controller_1 = require("../user/user.controller");
const user_service_1 = require("../user/user.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '300s' },
            }),
            cache_manager_1.CacheModule.register(),
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController],
        providers: [auth_service_1.AuthService, auth_guard_1.AuthGuard, core_1.Reflector, user_service_1.UserService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map