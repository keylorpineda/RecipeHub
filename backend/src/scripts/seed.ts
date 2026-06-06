/**
 * seed.ts — Poblar la base de datos con recetas de demostración con imágenes reales.
 *
 * Uso:
 *   cd backend
 *   npm run seed              # conecta a MONGO_URI del .env
 *   MONGO_URI=mongodb://... npm run seed
 *
 * Qué hace:
 *   1. Crea (o reutiliza) el usuario demo chef@recipehub.me
 *   2. Elimina todas las recetas previas de ese usuario
 *   3. Inserta 8 recetas nuevas con imágenes reales de Unsplash
 */

import dotenv from 'dotenv';
import path from 'path';

// .env raíz del monorepo (tres niveles arriba desde dist/scripts/ o dos desde src/scripts/)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Recipe from '../models/Recipe';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI no definida. Agrega la variable en el .env del monorepo o expórtala.');
  process.exit(1);
}

// ─── Usuario demo ─────────────────────────────────────────────────────────────

const DEMO = {
  nombre: 'Chef RecipeHub',
  email: 'chef@recipehub.me',
  password: 'RecipeHub2026!',
};

// ─── Recetas con imágenes reales ──────────────────────────────────────────────
// Todas las imágenes son de Unsplash (dominio público, CDN estable).

const RECIPES = [
  {
    titulo: 'Pasta Carbonara Clásica',
    descripcion:
      'La auténtica carbonara romana: solo huevo, guanciale, Pecorino Romano y pimienta negra. Sin crema, sin cebolla, sin ajo. El secreto está en la emulsión perfecta entre el huevo y el agua de cocción de la pasta.',
    categoria: 'Italiana',
    tiempoMin: 25,
    porciones: 4,
    dificultad: 'Media' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80',
    tags: ['italiana', 'pasta', 'clasica', 'sin-crema'],
    ingredientes: [
      { nombre: 'Espagueti', cantidad: 400, unidad: 'g' },
      { nombre: 'Guanciale o panceta', cantidad: 150, unidad: 'g' },
      { nombre: 'Huevos enteros', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Yemas de huevo', cantidad: 3, unidad: 'unidades' },
      { nombre: 'Pecorino Romano rallado', cantidad: 100, unidad: 'g' },
      { nombre: 'Pimienta negra', cantidad: 2, unidad: 'cucharaditas' },
      { nombre: 'Sal', cantidad: 1, unidad: 'cucharada' },
    ],
    pasos: [
      'Pon a hervir abundante agua con sal. Cocina el espagueti al dente según las instrucciones del paquete.',
      'Mientras tanto, corta el guanciale en cubos y dóralo a fuego medio-bajo en una sartén grande sin aceite hasta que esté crujiente. Reserva la grasa.',
      'En un bol, bate los huevos y las yemas con el Pecorino rallado y pimienta negra generosa hasta obtener una crema densa.',
      'Cuando la pasta esté lista, reserva 200 ml del agua de cocción antes de escurrir.',
      'Fuera del fuego, añade la pasta escurrida a la sartén con el guanciale. Agrega el agua de cocción reservada poco a poco.',
      'Vierte la mezcla de huevo y queso sobre la pasta removiendo rápidamente. El calor residual cocinará el huevo sin cuajarlo.',
      'Sirve inmediatamente con más Pecorino y pimienta negra recién molida.',
    ],
  },
  {
    titulo: 'Tacos al Pastor Auténticos',
    descripcion:
      'Los tacos al pastor son el alma de la calle mexicana: cerdo marinado en achiote y chiles secos, cocinado en trompo y servido con piña, cilantro y cebolla. Esta versión de sartén captura todos esos sabores en casa.',
    categoria: 'Mexicana',
    tiempoMin: 90,
    porciones: 6,
    dificultad: 'Media' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80',
    tags: ['mexicana', 'tacos', 'cerdo', 'picante', 'calle'],
    ingredientes: [
      { nombre: 'Lomo de cerdo', cantidad: 800, unidad: 'g' },
      { nombre: 'Pasta de achiote', cantidad: 3, unidad: 'cucharadas' },
      { nombre: 'Chiles guajillos secos', cantidad: 4, unidad: 'unidades' },
      { nombre: 'Vinagre blanco', cantidad: 3, unidad: 'cucharadas' },
      { nombre: 'Piña natural', cantidad: 200, unidad: 'g' },
      { nombre: 'Tortillas de maíz', cantidad: 18, unidad: 'unidades' },
      { nombre: 'Cebolla blanca', cantidad: 1, unidad: 'unidad' },
      { nombre: 'Cilantro fresco', cantidad: 1, unidad: 'manojo' },
      { nombre: 'Limones', cantidad: 4, unidad: 'unidades' },
    ],
    pasos: [
      'Hidrata los chiles guajillos en agua caliente 20 minutos. Licúa con el achiote, vinagre, ajo, sal y pimienta.',
      'Corta el cerdo en filetes finos de 3 mm. Marina con la salsa al menos 4 horas (idealmente toda la noche).',
      'En sartén muy caliente con un poco de aceite, cocina la carne por tandas 3 minutos por lado hasta dorar.',
      'Asa la piña en la misma sartén hasta caramelizar.',
      'Calienta las tortillas directamente en la llama o comal.',
      'Monta los tacos con la carne, piña, cebolla picada, cilantro y salsa verde. Acompaña con limón.',
    ],
  },
  {
    titulo: 'Sushi Rolls California',
    descripcion:
      'El California roll es el gateway perfecto al sushi: arroz sazonado con vinagre, aguacate cremoso, cangrejo y pepino, envuelto con algas nori y rebozado en semillas de sésamo. Ideal para hacer en casa sin necesidad de pescado crudo.',
    categoria: 'Asiática',
    tiempoMin: 60,
    porciones: 4,
    dificultad: 'Difícil' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&q=80',
    tags: ['japonesa', 'sushi', 'rolls', 'mariscos'],
    ingredientes: [
      { nombre: 'Arroz para sushi', cantidad: 300, unidad: 'g' },
      { nombre: 'Vinagre de arroz', cantidad: 60, unidad: 'ml' },
      { nombre: 'Azúcar', cantidad: 2, unidad: 'cucharadas' },
      { nombre: 'Sal', cantidad: 1, unidad: 'cucharadita' },
      { nombre: 'Hojas de nori', cantidad: 4, unidad: 'unidades' },
      { nombre: 'Aguacate maduro', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Palitos de cangrejo', cantidad: 150, unidad: 'g' },
      { nombre: 'Pepino japonés', cantidad: 1, unidad: 'unidad' },
      { nombre: 'Semillas de sésamo', cantidad: 4, unidad: 'cucharadas' },
      { nombre: 'Salsa de soja', cantidad: 100, unidad: 'ml' },
    ],
    pasos: [
      'Cocina el arroz según las instrucciones. Mezcla el vinagre, azúcar y sal calentando hasta disolver. Vierte sobre el arroz tibio y mezcla con movimientos de corte.',
      'Corta el aguacate, pepino y cangrejo en bastones.',
      'Coloca una hoja de nori sobre la esterilla. Distribuye el arroz en una capa delgada dejando 2 cm libre en el extremo superior.',
      'Para el California roll, voltea el nori con el arroz hacia abajo. Coloca el relleno y enrolla firmemente.',
      'Reboza el exterior en semillas de sésamo. Presiona suavemente con la esterilla.',
      'Con un cuchillo mojado, corta en 8 piezas limpias. Sirve con salsa de soja, wasabi y jengibre encurtido.',
    ],
  },
  {
    titulo: 'Paella Valenciana',
    descripcion:
      'La paella auténtica de Valencia se hace con pollo, conejo, judías verdes y garrafón, jamás con mariscos. La clave es el socarrat: la capa dorada y crujiente de arroz en el fondo de la paellera que se forma al final de la cocción.',
    categoria: 'Española',
    tiempoMin: 75,
    porciones: 6,
    dificultad: 'Difícil' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=900&q=80',
    tags: ['española', 'arroz', 'valenciana', 'pollo'],
    ingredientes: [
      { nombre: 'Arroz valenciano (tipo bomba)', cantidad: 500, unidad: 'g' },
      { nombre: 'Pollo troceado', cantidad: 600, unidad: 'g' },
      { nombre: 'Conejo troceado', cantidad: 400, unidad: 'g' },
      { nombre: 'Judías verdes planas', cantidad: 200, unidad: 'g' },
      { nombre: 'Garrafón en conserva', cantidad: 150, unidad: 'g' },
      { nombre: 'Tomate maduro rallado', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Pimentón dulce', cantidad: 2, unidad: 'cucharaditas' },
      { nombre: 'Hebras de azafrán', cantidad: 1, unidad: 'pellizco' },
      { nombre: 'Caldo de pollo caliente', cantidad: 1500, unidad: 'ml' },
      { nombre: 'Aceite de oliva virgen extra', cantidad: 100, unidad: 'ml' },
    ],
    pasos: [
      'Calienta el aceite en la paellera a fuego fuerte. Dora el pollo y el conejo hasta que estén bien sellados. Retira y reserva.',
      'En la misma paellera sofríe las judías verdes 5 minutos. Añade el tomate rallado y cocina hasta que evapore el agua.',
      'Incorpora el pimentón y rápidamente el caldo caliente para que no se queme. Añade el azafrán.',
      'Devuelve la carne a la paellera. Cocina el caldo 20 minutos a fuego medio.',
      'Vierte el arroz en forma de cruz y distribúyelo sin remover más. Cuece 10 minutos a fuego alto.',
      'Baja el fuego al mínimo y cocina 8 minutos más. En los últimos 2 minutos sube el fuego para crear el socarrat.',
      'Deja reposar 5 minutos tapada con papel de periódico antes de servir.',
    ],
  },
  {
    titulo: 'Croissants de Mantequilla',
    descripcion:
      'Hacer croissants desde cero es un proceso de dos días que vale cada minuto. La clave está en el laminado: capas y capas de masa separadas por mantequilla fría que al hornear crean esa textura hojaldrada y aérea incomparable.',
    categoria: 'Francesa',
    tiempoMin: 180,
    porciones: 12,
    dificultad: 'Difícil' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80',
    tags: ['francesa', 'panaderia', 'hojaldrada', 'desayuno'],
    ingredientes: [
      { nombre: 'Harina de fuerza', cantidad: 500, unidad: 'g' },
      { nombre: 'Leche entera', cantidad: 300, unidad: 'ml' },
      { nombre: 'Levadura fresca', cantidad: 20, unidad: 'g' },
      { nombre: 'Azúcar', cantidad: 50, unidad: 'g' },
      { nombre: 'Sal', cantidad: 10, unidad: 'g' },
      { nombre: 'Mantequilla para el détrempe', cantidad: 40, unidad: 'g' },
      { nombre: 'Mantequilla fría para el laminado', cantidad: 280, unidad: 'g' },
      { nombre: 'Huevo para pintar', cantidad: 1, unidad: 'unidad' },
    ],
    pasos: [
      'Día 1 — Détrempe: Mezcla harina, sal, azúcar, levadura, leche y mantequilla. Amasa 5 minutos hasta masa lisa. Refrigera 8 horas.',
      'Golpea la mantequilla fría entre papel film hasta formar un cuadrado de 20×20 cm. Refrigera.',
      'Día 2 — Extiende la masa en un rectángulo. Coloca la mantequilla en el centro y sella los bordes.',
      'Primer laminado: estira a 60 cm, haz un pliegue de carta (3 capas). Refrigera 30 min. Repite 2 veces más.',
      'Estira la masa a 4 mm. Corta triángulos largos de base 8 cm. Enrosca desde la base hacia la punta.',
      'Coloca en bandeja y deja fermentar 2-3 horas hasta doblar tamaño.',
      'Pinta con huevo batido. Hornea a 200°C unos 18-20 minutos hasta dorado intenso.',
    ],
  },
  {
    titulo: 'Tiramisu Tradicional',
    descripcion:
      'El postre italiano por excelencia: capas de bizcochos empapados en café expreso y licor, alternadas con crema de mascarpone y yemas. Sin horno, sin gelatina, sin trucos. Solo los 6 ingredientes originales de la receta de Treviso.',
    categoria: 'Postres',
    tiempoMin: 30,
    porciones: 8,
    dificultad: 'Fácil' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80',
    tags: ['italiana', 'postre', 'cafe', 'sin-horno', 'mascarpone'],
    ingredientes: [
      { nombre: 'Bizcochos de soletilla (Savoiardi)', cantidad: 300, unidad: 'g' },
      { nombre: 'Mascarpone', cantidad: 500, unidad: 'g' },
      { nombre: 'Yemas de huevo', cantidad: 6, unidad: 'unidades' },
      { nombre: 'Azúcar', cantidad: 150, unidad: 'g' },
      { nombre: 'Café expreso frío', cantidad: 300, unidad: 'ml' },
      { nombre: 'Amaretto o Marsala', cantidad: 3, unidad: 'cucharadas' },
      { nombre: 'Cacao en polvo sin azúcar', cantidad: 3, unidad: 'cucharadas' },
    ],
    pasos: [
      'Bate las yemas con el azúcar en baño María hasta que blanqueen y tripliquen su volumen (unos 8 minutos). Retira del fuego y enfría.',
      'Incorpora el mascarpone a las yemas con movimientos envolventes hasta obtener una crema homogénea y suave.',
      'Mezcla el café frío con el licor en un bol hondo.',
      'Sumerge los bizcochos brevemente (1-2 segundos por lado) en el café. No los empapar demasiado.',
      'Forma una capa de bizcochos en el molde. Cubre con la mitad de la crema de mascarpone.',
      'Repite la capa de bizcochos y termina con el resto de la crema. Alisa la superficie.',
      'Refrigera mínimo 4 horas (mejor toda la noche). Espolvorea cacao justo antes de servir.',
    ],
  },
  {
    titulo: 'Pad Thai Auténtico',
    descripcion:
      'El wok es el alma del Pad Thai. Fideos de arroz salteados a fuego muy alto con gambas, tofu, brotes de soja y huevo, glaseados con la inconfundible salsa de tamarindo. La clave: wok muy caliente y no remover demasiado para conseguir ese ahumado característico.',
    categoria: 'Asiática',
    tiempoMin: 30,
    porciones: 2,
    dificultad: 'Media' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=900&q=80',
    tags: ['tailandesa', 'fideos', 'gambas', 'wok', 'sin-gluten'],
    ingredientes: [
      { nombre: 'Fideos de arroz planos', cantidad: 200, unidad: 'g' },
      { nombre: 'Gambas peladas', cantidad: 150, unidad: 'g' },
      { nombre: 'Tofu firme', cantidad: 100, unidad: 'g' },
      { nombre: 'Pasta de tamarindo', cantidad: 3, unidad: 'cucharadas' },
      { nombre: 'Salsa de pescado', cantidad: 2, unidad: 'cucharadas' },
      { nombre: 'Azúcar de palma', cantidad: 2, unidad: 'cucharadas' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Brotes de soja', cantidad: 100, unidad: 'g' },
      { nombre: 'Cebolleta', cantidad: 3, unidad: 'tallos' },
      { nombre: 'Cacahuetes tostados', cantidad: 50, unidad: 'g' },
      { nombre: 'Lima', cantidad: 1, unidad: 'unidad' },
    ],
    pasos: [
      'Hidrata los fideos en agua fría 30 minutos. Escurre bien.',
      'Mezcla la pasta de tamarindo, salsa de pescado y azúcar de palma. Prueba y ajusta al gusto.',
      'Calienta el wok a fuego máximo hasta humear. Añade aceite y saltea el tofu hasta dorar.',
      'Agrega las gambas y cocina 1 minuto. Empuja todo a un lado y añade los fideos.',
      'Vierte la salsa sobre los fideos y saltea 2 minutos removiendo frecuentemente.',
      'Crea un hueco en el centro, añade el huevo y revuelve para que se mezcle con los fideos.',
      'Incorpora los brotes de soja y la cebolleta. Saltea 30 segundos más.',
      'Sirve con cacahuetes picados, lima y chili en escamas al gusto.',
    ],
  },
  {
    titulo: 'Ramen de Miso y Cerdo',
    descripcion:
      'Un tazón de ramen hecho en casa con caldo umami de miso, chashu de cerdo meloso, huevo marinado con yema líquida y noodles elásticos. El caldo requiere tiempo pero el resultado supera cualquier restaurante.',
    categoria: 'Asiática',
    tiempoMin: 240,
    porciones: 4,
    dificultad: 'Difícil' as const,
    imagenUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=900&q=80',
    tags: ['japonesa', 'ramen', 'cerdo', 'miso', 'sopa'],
    ingredientes: [
      { nombre: 'Noodles de ramen frescos', cantidad: 400, unidad: 'g' },
      { nombre: 'Panceta de cerdo entera', cantidad: 500, unidad: 'g' },
      { nombre: 'Caldo de pollo', cantidad: 1500, unidad: 'ml' },
      { nombre: 'Pasta de miso blanco', cantidad: 4, unidad: 'cucharadas' },
      { nombre: 'Mirin', cantidad: 3, unidad: 'cucharadas' },
      { nombre: 'Salsa de soja', cantidad: 4, unidad: 'cucharadas' },
      { nombre: 'Jengibre fresco', cantidad: 30, unidad: 'g' },
      { nombre: 'Huevos', cantidad: 4, unidad: 'unidades' },
      { nombre: 'Maíz dulce', cantidad: 100, unidad: 'g' },
      { nombre: 'Nori', cantidad: 4, unidad: 'láminas' },
      { nombre: 'Aceite de sésamo', cantidad: 2, unidad: 'cucharaditas' },
    ],
    pasos: [
      'Chashu: Enrolla la panceta, átala con hilo y dórala en sartén por todos los lados. Cuece a fuego lento en soja, mirin y agua 2 horas.',
      'Tare de miso: Sofríe jengibre en aceite, añade el miso, mirin y soja. Cocina 5 minutos a fuego bajo.',
      'Huevos marinados: Cuece los huevos 6 minutos y 30 segundos exactos. Enfría en hielo, pela y marina en soja + mirin + agua durante 4 horas.',
      'Calienta el caldo de pollo, añade el tare de miso al gusto. Ajusta de sal.',
      'Cuece los noodles según instrucciones, escurre.',
      'En cada tazón sirve los noodles, vierte el caldo muy caliente. Corona con rodajas de chashu, medio huevo marinado, maíz y nori.',
      'Termina con unas gotas de aceite de sésamo y cebolleta picada.',
    ],
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🔌 Conectando a MongoDB…');
  await mongoose.connect(MONGO_URI as string);
  console.log('✅ Conectado.\n');

  // 1. Crear o reutilizar usuario demo
  let user = await User.findOne({ email: DEMO.email });
  if (!user) {
    const hashed = await bcrypt.hash(DEMO.password, 10);
    user = await User.create({ nombre: DEMO.nombre, email: DEMO.email, password: hashed });
    console.log(`👤 Usuario creado: ${DEMO.email}`);
  } else {
    console.log(`👤 Usuario existente reutilizado: ${DEMO.email}`);
  }

  // 2. Eliminar recetas previas del usuario demo
  const deleted = await Recipe.deleteMany({ autorId: user._id });
  console.log(`🗑  ${deleted.deletedCount} receta(s) anteriores eliminadas.\n`);

  // 3. Insertar recetas con imagen
  for (const r of RECIPES) {
    await Recipe.create({ ...r, autorId: user._id });
    console.log(`  ✔ ${r.titulo}`);
  }

  console.log(`\n🌱 Seed completo — ${RECIPES.length} recetas creadas con imágenes.`);
  console.log(`\nCredenciales del usuario demo:`);
  console.log(`  Email   : ${DEMO.email}`);
  console.log(`  Password: ${DEMO.password}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});
