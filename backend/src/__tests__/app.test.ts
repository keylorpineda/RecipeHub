import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import { Server } from 'http';
import app from '../index';
import User from '../models/User';
import Recipe from '../models/Recipe';
import Comment from '../models/Comment';

const MONGO_URI_TEST = process.env.MONGO_URI || 'mongodb://localhost:27017/recipehub_test';

let server: Server;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function registerUser(nombre = 'Test User', email = 'test@example.com', password = 'password123') {
  const res = await request(app).post('/api/auth/register').send({ nombre, email, password });
  if (res.status !== 201) console.log('REGISTER USER FAILED:', res.status, res.body);
  const setCookie = res.headers['set-cookie'] as unknown as string[];
  const cookie = setCookie?.find((c) => c.startsWith('token='))?.split(';')[0] ?? '';
  return { cookie, user: res.body.user as Record<string, unknown>, status: res.status };
}

const recipeBase = {
  titulo: 'Pasta Carbonara',
  descripcion: 'Receta clásica italiana de pasta cremosa',
  categoria: 'Pastas',
  tiempoMin: 30,
  porciones: 2,
  dificultad: 'Media',
  ingredientes: [{ nombre: 'Pasta', cantidad: 200, unidad: 'g' }],
  pasos: ['Cocer la pasta al dente', 'Preparar la salsa carbonara'],
  tags: ['italiana', 'rapida'],
  imagenUrl: 'https://example.com/pasta.jpg',
};

async function createRecipe(cookie: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/recetas')
    .set('Cookie', cookie)
    .send({ ...recipeBase, ...overrides });
  if (res.status !== 201) console.log('CREATE RECIPE FAILED:', res.status, res.body);
  return { receta: res.body.receta as Record<string, unknown>, status: res.status };
}

async function createComment(cookie: string, recetaId: string, texto = 'Muy buena receta', calificacion = 5) {
  const res = await request(app).post(`/api/recetas/${recetaId}/comentarios`).set('Cookie', cookie).send({ texto, calificacion });
  return { comentario: res.body.comentario as Record<string, unknown>, status: res.status };
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(MONGO_URI_TEST);
  server = app.listen(0);
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
}, 30000);

afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
}, 10000);

// ─── 1. Health ────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('retorna 200 con status ok y timestamp ISO', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(typeof res.body.timestamp).toBe('string');
    expect(() => new Date(res.body.timestamp)).not.toThrow();
  });
});

// ─── 2. Auth — register ───────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('201: crea usuario, omite password del body y establece cookie HttpOnly', async () => {
    const { status, cookie, user } = await registerUser();
    expect(status).toBe(201);
    expect(user).toMatchObject({ nombre: 'Test User', email: 'test@example.com' });
    expect(user).not.toHaveProperty('password');
    expect(cookie).toMatch(/^token=.+/);
  });

  it('400: email duplicado devuelve error descriptivo', async () => {
    await registerUser();
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Otro', email: 'test@example.com', password: 'pass123' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('400: falta nombre', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@a.com', password: 'pass123' });
    expect(res.status).toBe(400);
  });

  it('400: falta password', async () => {
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Test', email: 'a@a.com' });
    expect(res.status).toBe(400);
  });
});

// ─── 3. Auth — login ──────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('200: credenciales correctas retornan usuario y establecen cookie', async () => {
    await registerUser('Login User', 'login@example.com', 'mypassword');
    const res = await request(app).post('/api/auth/login').send({ email: 'login@example.com', password: 'mypassword' });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ email: 'login@example.com' });
    expect(res.body.user).not.toHaveProperty('password');
    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies?.some((c) => c.startsWith('token='))).toBe(true);
  });

  it('401: email que no existe', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'noexiste@example.com', password: 'cualquiera' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('401: contraseña incorrecta', async () => {
    await registerUser('User', 'user@example.com', 'correctpass');
    const res = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('400: campos faltantes', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'only@email.com' });
    expect(res.status).toBe(400);
  });
});

// ─── 4. Auth — logout ─────────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('200: borra el valor de la cookie token', async () => {
    const { cookie } = await registerUser();
    const res = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(res.status).toBe(200);
    const cookies = res.headers['set-cookie'] as unknown as string[] | undefined;
    const tokenCookie = cookies?.find((c) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toMatch(/token=(?:;|$)/);
  });

  it('200: funciona sin cookie (no requiere autenticación)', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
  });
});

// ─── 5. Auth — me ─────────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('200: retorna datos del usuario autenticado sin password', async () => {
    const { cookie } = await registerUser('Me User', 'me@example.com');
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ email: 'me@example.com', nombre: 'Me User' });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('401: sin cookie ni header Authorization', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('401: token con firma inválida', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', 'token=esto.no.es.un.jwt.valido');
    expect(res.status).toBe(401);
  });
});

// ─── 6. Recetas — listado y filtros ──────────────────────────────────────────

describe('GET /api/recetas', () => {
  it('200: devuelve array vacío cuando no hay recetas', async () => {
    const res = await request(app).get('/api/recetas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.recetas)).toBe(true);
    expect(res.body.recetas).toHaveLength(0);
  });

  it('200: devuelve recetas con autorId populado (nombre y email)', async () => {
    const { cookie } = await registerUser();
    await createRecipe(cookie);
    const res = await request(app).get('/api/recetas');
    expect(res.status).toBe(200);
    expect(res.body.recetas).toHaveLength(1);
    expect(res.body.recetas[0].autorId).toHaveProperty('nombre');
    expect(res.body.recetas[0].autorId).toHaveProperty('email');
  });

  it('200: filtra por categoria — devuelve solo las coincidentes', async () => {
    const { cookie } = await registerUser();
    await createRecipe(cookie, { categoria: 'Sopas', titulo: 'Sopa de tomate' });
    await createRecipe(cookie, { categoria: 'Postres', titulo: 'Flan' });
    const res = await request(app).get('/api/recetas?categoria=Sopas');
    expect(res.status).toBe(200);
    expect(res.body.recetas).toHaveLength(1);
    expect(res.body.recetas[0].categoria).toBe('Sopas');
  });

  it('200: filtra por dificultad', async () => {
    const { cookie } = await registerUser();
    await createRecipe(cookie, { dificultad: 'Fácil', titulo: 'Ensalada' });
    await createRecipe(cookie, { dificultad: 'Difícil', titulo: 'Soufflé' });
    const res = await request(app).get('/api/recetas?dificultad=Fácil');
    expect(res.status).toBe(200);
    expect(res.body.recetas).toHaveLength(1);
    expect(res.body.recetas[0].dificultad).toBe('Fácil');
  });

  it('200: filtra por tags', async () => {
    const { cookie } = await registerUser();
    await createRecipe(cookie, { tags: ['vegano'], titulo: 'Bowl vegano' });
    await createRecipe(cookie, { tags: ['carnico'], titulo: 'Asado' });
    const res = await request(app).get('/api/recetas?tags=vegano');
    expect(res.status).toBe(200);
    expect(res.body.recetas).toHaveLength(1);
    expect(res.body.recetas[0].tags).toContain('vegano');
  });
});

// ─── 7. Recetas — crear ───────────────────────────────────────────────────────

describe('POST /api/recetas', () => {
  it('201: crea receta con todos los campos y asigna autorId', async () => {
    const { cookie } = await registerUser();
    const { status, receta } = await createRecipe(cookie);
    expect(status).toBe(201);
    expect(receta).toMatchObject({ titulo: 'Pasta Carbonara', categoria: 'Pastas' });
    expect(receta).toHaveProperty('autorId');
    expect(receta).toHaveProperty('createdAt');
  });

  it('401: sin autenticación devuelve 401', async () => {
    const res = await request(app).post('/api/recetas').send(recipeBase);
    expect(res.status).toBe(401);
  });

  it('400: faltan campos requeridos', async () => {
    const { cookie } = await registerUser();
    const res = await request(app).post('/api/recetas').set('Cookie', cookie).send({ titulo: 'Incompleta' });
    expect(res.status).toBe(400);
  });

  it('400: dificultad fuera del enum rechazada por Mongoose', async () => {
    const { cookie } = await registerUser();
    const { status } = await createRecipe(cookie, { dificultad: 'Imposible' });
    expect(status).toBe(400);
  });
});

// ─── 8. Recetas — obtener por id ─────────────────────────────────────────────

describe('GET /api/recetas/:id', () => {
  it('200: devuelve receta completa con autorId populado', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).get(`/api/recetas/${receta._id}`);
    expect(res.status).toBe(200);
    expect(res.body.receta._id).toBe(receta._id);
    expect(res.body.receta.autorId).toHaveProperty('nombre');
    expect(res.body.receta).toHaveProperty('ingredientes');
    expect(res.body.receta).toHaveProperty('pasos');
  });

  it('404: ObjectId válido pero no existente en BD', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/recetas/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('500: id con formato inválido lanza error de cast', async () => {
    const res = await request(app).get('/api/recetas/formato-invalido');
    expect(res.status).toBe(500);
  });
});

// ─── 9. Recetas — editar ─────────────────────────────────────────────────────

describe('PUT /api/recetas/:id', () => {
  it('200: autor puede actualizar campos de su receta', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).put(`/api/recetas/${receta._id}`).set('Cookie', cookie).send({ titulo: 'Pasta Actualizada', tiempoMin: 45 });
    expect(res.status).toBe(200);
    expect(res.body.receta.titulo).toBe('Pasta Actualizada');
    expect(res.body.receta.tiempoMin).toBe(45);
  });

  it('200: updatedAt es posterior al createdAt tras el PUT', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    await new Promise((r) => setTimeout(r, 20));
    const res = await request(app).put(`/api/recetas/${receta._id}`).set('Cookie', cookie).send({ titulo: 'Nuevo título' });
    expect(res.status).toBe(200);
    const updatedAt = new Date(res.body.receta.updatedAt as string).getTime();
    const createdAt = new Date(receta.createdAt as string).getTime();
    expect(updatedAt).toBeGreaterThan(createdAt);
  });

  it('403: otro usuario no puede editar la receta', async () => {
    const { cookie: cookieAutor } = await registerUser('Autor', 'autor@example.com');
    const { cookie: cookieOtro } = await registerUser('Intruso', 'intruso@example.com');
    const { receta } = await createRecipe(cookieAutor);
    const res = await request(app).put(`/api/recetas/${receta._id}`).set('Cookie', cookieOtro).send({ titulo: 'Modificación no autorizada' });
    expect(res.status).toBe(403);
  });

  it('401: sin autenticación', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).put(`/api/recetas/${receta._id}`).send({ titulo: 'Sin auth' });
    expect(res.status).toBe(401);
  });

  it('404: receta inexistente', async () => {
    const { cookie } = await registerUser();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/recetas/${fakeId}`).set('Cookie', cookie).send({ titulo: 'Nada' });
    expect(res.status).toBe(404);
  });
});

// ─── 10. Recetas — eliminar ───────────────────────────────────────────────────

describe('DELETE /api/recetas/:id', () => {
  it('200: autor elimina su receta y ya no existe en BD', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).delete(`/api/recetas/${receta._id}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/recetas/${receta._id}`);
    expect(check.status).toBe(404);
  });

  it('403: otro usuario no puede eliminar la receta', async () => {
    const { cookie: cookieAutor } = await registerUser('Autor', 'autor@example.com');
    const { cookie: cookieOtro } = await registerUser('Intruso', 'intruso@example.com');
    const { receta } = await createRecipe(cookieAutor);
    const res = await request(app).delete(`/api/recetas/${receta._id}`).set('Cookie', cookieOtro);
    expect(res.status).toBe(403);
  });

  it('401: sin autenticación', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).delete(`/api/recetas/${receta._id}`);
    expect(res.status).toBe(401);
  });

  it('404: receta inexistente', async () => {
    const { cookie } = await registerUser();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/recetas/${fakeId}`).set('Cookie', cookie);
    expect(res.status).toBe(404);
  });
});

// ─── 11. Comentarios — listar ─────────────────────────────────────────────────

describe('GET /api/recetas/:id/comentarios', () => {
  it('200: array vacío cuando la receta no tiene comentarios', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).get(`/api/recetas/${receta._id}/comentarios`);
    expect(res.status).toBe(200);
    expect(res.body.comentarios).toEqual([]);
  });

  it('200: devuelve comentarios con usuarioId populado (nombre)', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    await createComment(cookie, receta._id as string, 'Excelente receta', 4);
    const res = await request(app).get(`/api/recetas/${receta._id}/comentarios`);
    expect(res.status).toBe(200);
    expect(res.body.comentarios).toHaveLength(1);
    expect(res.body.comentarios[0]).toMatchObject({ texto: 'Excelente receta', calificacion: 4 });
    expect(res.body.comentarios[0].usuarioId).toHaveProperty('nombre');
  });
});

// ─── 12. Comentarios — crear ──────────────────────────────────────────────────

describe('POST /api/recetas/:id/comentarios', () => {
  it('201: crea comentario con texto y calificacion válidos', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const { status, comentario } = await createComment(cookie, receta._id as string, 'Increíble sabor', 5);
    expect(status).toBe(201);
    expect(comentario).toMatchObject({ texto: 'Increíble sabor', calificacion: 5 });
  });

  it('201: acepta calificacion mínima (1)', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const { status } = await createComment(cookie, receta._id as string, 'Regular', 1);
    expect(status).toBe(201);
  });

  it('400: calificacion 0 fuera del rango permitido', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).post(`/api/recetas/${receta._id}/comentarios`).set('Cookie', cookie).send({ texto: 'Test', calificacion: 0 });
    expect(res.status).toBe(400);
  });

  it('400: calificacion 6 fuera del rango permitido', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).post(`/api/recetas/${receta._id}/comentarios`).set('Cookie', cookie).send({ texto: 'Test', calificacion: 6 });
    expect(res.status).toBe(400);
  });

  it('400: falta calificacion en el body', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).post(`/api/recetas/${receta._id}/comentarios`).set('Cookie', cookie).send({ texto: 'Sin calificacion' });
    expect(res.status).toBe(400);
  });

  it('401: sin autenticación', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const res = await request(app).post(`/api/recetas/${receta._id}/comentarios`).send({ texto: 'Sin auth', calificacion: 3 });
    expect(res.status).toBe(401);
  });
});

// ─── 13. Comentarios — eliminar ───────────────────────────────────────────────

describe('DELETE /api/comentarios/:id', () => {
  it('200: autor elimina su propio comentario', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const { comentario } = await createComment(cookie, receta._id as string);
    const res = await request(app).delete(`/api/comentarios/${comentario._id}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('403: otro usuario no puede eliminar el comentario', async () => {
    const { cookie: cookieAutor } = await registerUser('Autor', 'autor@example.com');
    const { cookie: cookieOtro } = await registerUser('Intruso', 'intruso@example.com');
    const { receta } = await createRecipe(cookieAutor);
    const { comentario } = await createComment(cookieAutor, receta._id as string);
    const res = await request(app).delete(`/api/comentarios/${comentario._id}`).set('Cookie', cookieOtro);
    expect(res.status).toBe(403);
  });

  it('401: sin autenticación', async () => {
    const { cookie } = await registerUser();
    const { receta } = await createRecipe(cookie);
    const { comentario } = await createComment(cookie, receta._id as string);
    const res = await request(app).delete(`/api/comentarios/${comentario._id}`);
    expect(res.status).toBe(401);
  });

  it('404: comentario inexistente', async () => {
    const { cookie } = await registerUser();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/comentarios/${fakeId}`).set('Cookie', cookie);
    expect(res.status).toBe(404);
  });
});
