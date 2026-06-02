import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import { Server } from 'http';
import app from '../index';
import User from '../models/User';

const MONGO_URI_TEST =
  process.env.MONGO_URI_TEST ?? 'mongodb://localhost:27017/recipehub_test';

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

// ─── TEST 2: Register con email duplicado ─────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('retorna 400 con error al registrar un email ya existente', async () => {
    const payload = {
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
    };

    // Primer registro: debe tener éxito
    const first = await request(app).post('/api/auth/register').send(payload);
    expect(first.status).toBe(201);

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
