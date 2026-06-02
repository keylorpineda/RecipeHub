export interface IUser {
  _id: string;
  nombre: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface IIngrediente {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface IRecipe {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tiempoMin: number;
  porciones: number;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  ingredientes: IIngrediente[];
  pasos: string[];
  tags: string[];
  autorId: { _id: string; nombre: string; email: string };
  imagenUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  recetaId: string;
  usuarioId: { _id: string; nombre: string };
  texto: string;
  calificacion: number;
  createdAt: string;
}
