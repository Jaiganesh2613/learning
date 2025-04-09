export declare class User {
    id: number;
    name: string;
    age: number;
    gender: string;
    phn: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    hashPassword(): Promise<void>;
}
