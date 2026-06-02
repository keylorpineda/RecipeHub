import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  recetaId: Types.ObjectId;
  usuarioId: Types.ObjectId;
  texto: string;
  calificacion: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  recetaId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  texto: {
    type: String,
    required: true,
    trim: true,
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'La calificación debe ser un número entero',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IComment>('Comment', commentSchema);
