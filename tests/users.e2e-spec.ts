import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({ email: 'a@a.ru', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Register - success', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ name: 'john paul gabule', email: 'hpS@gmail.com', password: 'password' });
		expect(res.statusCode).toBe(200);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'hp@gmail.com', password: 'password' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'hssp@gmail.com', password: 'password' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const result = await request(application.app)
			.post('/users/login')
			.send({ email: 'hp@gmail.com', password: 'password' });
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer ${result.body.jwt}`);
		expect(res.body.email).toBe('hp@gmail.com');
	});
});

afterAll(() => {
	application.close();
});
