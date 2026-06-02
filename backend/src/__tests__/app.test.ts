import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import { Server } from 'http';
import app from '../index';
import User from '../models/User';

const MONGO_URI_TEST = process.env.MONGO_URI_TEST ?? 'mongodb://localhost:27017/recipehub_test';

let server: Server;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI_TEST);
  server = app.listen(0); // puerto aleatorio, evita conflictos
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

// ─── TEST 1: Health endpoint ──────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('retorna 200 con status ok y timestamp', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('string');
  });
});

// ─── TEST 2: Register — cookie presente y email duplicado ─────────────────────

describe('POST /api/auth/register', () => {
  it('setea la cookie token en el primer registro y retorna 400 en el segundo', async () => {
    const payload = {
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
    };

    // Primer registro: debe tener éxito y enviar la cookie
    const first = await request(app).post('/api/auth/register').send(payload);
    expect(first.status).toBe(201);
    expect(first.body).toHaveProperty('user');
    expect(first.body).not.toHaveProperty('token'); // token ya no va en el body

    const setCookie = first.headers['set-cookie'] as string[] | undefined;
    expect(setCookie).toBeDefined();
    expect(setCookie!.some((c) => c.startsWith('token='))).toBe(true);

    // Segundo registro con el mismo email: debe fallar
    const second = await request(app).post('/api/auth/register').send(payload);
    expect(second.status).toBe(400);
    expect(second.body).toEqual({ error: 'Email ya registrado' });
  });
});

// ─── TEST 3: Login con credenciales incorrectas ───────────────────────────────

describe('POST /api/auth/login', () => {
  it('retorna 401 con campo error cuando el email no existe', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'noexiste@example.com',
      password: 'cualquier_pass',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── TEST 4: Ruta protegida usando cookie ─────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('retorna el usuario autenticado cuando se envía la cookie token', async () => {
    // Registrar para obtener la cookie
    const registerRes = await request(app).post('/api/auth/register').send({
      nombre: 'Cookie User',
      email: 'cookie@example.com',
      password: 'securepass',
    });
    expect(registerRes.status).toBe(201);

    // Extraer el valor de la cookie 'token'
    const setCookie = registerRes.headers['set-cookie'] as string[];
    const tokenCookie = setCookie.find((c) => c.startsWith('token='))!;

    // Usar la cookie en la ruta protegida
    const meRes = await request(app).get('/api/auth/me').set('Cookie', tokenCookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body).toHaveProperty('user');
    expect(meRes.body.user).toMatchObject({ email: 'cookie@example.com' });
    expect(meRes.body.user).not.toHaveProperty('password');
  });

  it('retorna 401 sin cookie ni header Authorization', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
