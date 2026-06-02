import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IIngrediente {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface IRecipe extends Document {
  titulo: string;
  descripcion: string;
  categoria: string;
  tiempoMin: number;
  porciones: number;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  ingredientes: IIngrediente[];
  pasos: string[];
  tags: string[];
  autorId: Types.ObjectId;
  imagenUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ingredienteSchema = new Schema<IIngrediente>(
  {
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    unidad: { type: String, required: true },
  },
  { _id: false },
);

const recipeSchema = new Schema<IRecipe>({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  tiempoMin: {
    type: Number,
    required: true,
    min: 1,
  },
  porciones: {
    type: Number,
    required: true,
    min: 1,
  },
  dificultad: {
    type: String,
    required: true,
    enum: ['Fácil', 'Media', 'Difícil'],
  },
  ingredientes: {
    type: [ingredienteSchema],
    required: true,
    validate: {
      validator: (arr: IIngrediente[]) => arr.length >= 1,
      message: 'Debe haber al menos un ingrediente',
    },
  },
  pasos: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: string[]) => arr.length >= 1,
      message: 'Debe haber al menos un paso',
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  autorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imagenUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IRecipe>('Recipe', recipeSchema);
