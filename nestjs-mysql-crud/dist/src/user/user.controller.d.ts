import { UserService } from './user.service';
import { User } from './user.entity';
import { Request } from 'express';
import { Cache } from 'cache-manager';
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}
export declare class UserController {
    private userService;
    private cacheManager;
    constructor(userService: UserService, cacheManager: Cache);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    update(id: string, updateData: Partial<User>, req: AuthenticatedRequest): Promise<User>;
    delete(id: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
