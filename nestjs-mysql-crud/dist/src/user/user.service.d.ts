import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    update(id: number, updateData: Partial<User>, userId: number): Promise<User>;
    delete(id: number, userId: number): Promise<{
        message: string;
    }>;
}
