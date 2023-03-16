import { IsString, IsEmail } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Name is required.' })
	name: string;

	@IsEmail({}, { message: 'Email is required.' })
	email: string;

	@IsString({ message: 'Password is required.' })
	password: string;
}
