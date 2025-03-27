export declare class User {
    id: number;
    name: string;
    age: number;
    gender: string;
    phn: string;
    email: string;
    password: string;
    hashPassword(): Promise<void>;
}
