// import {
//   IsNotEmpty,
//   IsString,
//   IsInt,
//   Min,
//   Max,
//   Length,
//   IsPhoneNumber,
// } from 'class-validator';
//
// export class CreateUserDto {
//   @IsNotEmpty({ message: 'Name is required' })
//   @IsString({ message: 'Name must be a string' })
//   name: string;
//
//   @IsInt({ message: 'Age must be a number' })
//   @Min(1, { message: 'Age must be at least 1' })
//   @Max(100, { message: 'Age must not exceed 100' })
//   age: number;
//
//   @IsNotEmpty({ message: 'Gender is required' })
//   @IsString({ message: 'Gender must be a string' })
//   gender: string;
//
//   @IsNotEmpty({ message: 'Phone number is required' })
//   @IsPhoneNumber('IN', { message: 'Invalid phone number' })
//   phn: string;
//
//   @IsNotEmpty({ message: 'Password is required' })
//   @Length(6, 20, { message: 'Password must be between 6-20 characters' })
//   password: string;
// }
