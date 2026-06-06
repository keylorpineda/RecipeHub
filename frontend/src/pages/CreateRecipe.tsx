import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { IIngrediente } from '../types';

interface IngredienteRow extends IIngrediente {
  id: number;
}

const emptyIng = (id: number): IngredienteRow => ({ id, nombre: '', cantidad: 0, unidad: '' });
const DIFICULTADES = ['Fácil', 'Media', 'Difícil'] as const;

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tiempoMin, setTiempoMin] = useState('');
  const [porciones, setPorciones] = useState('');
  const [dificultad, setDificultad] = useState<'Fácil' | 'Media' | 'Difícil' | ''>('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [tags, setTags] = useState('');
  const [ingredientes, setIngredientes] = useState<IngredienteRow[]>([emptyIng(1)]);
  const [pasos, setPasos] = useState<{ id: number; texto: string }[]>([{ id: 1, texto: '' }]);
  const [nextId, setNextId] = useState(2);

  function addIngrediente() {
    setIngredientes((p) => [...p, emptyIng(nextId)]);
    setNextId((n) => n + 1);
  }
  function removeIngrediente(id: number) {
    setIngredientes((p) => p.filter((i) => i.id !== id));
  }
  function updateIngrediente(id: number, field: keyof IIngrediente, value: string | number) {
    setIngredientes((p) => p.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Enviamos el archivo a nuestro backend
      const { data } = await api.post<{ secure_url: string }>('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImagenUrl(data.secure_url);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Error al subir la imagen';
      setImageError(msg);
    } finally {
      setIsUploadingImage(false);
    }
  }

  function addPaso() {
    setPasos((p) => [...p, { id: nextId, texto: '' }]);
    setNextId((n) => n + 1);
  }
  function removePaso(id: number) {
    setPasos((p) => p.filter((s) => s.id !== id));
  }
  function updatePaso(id: number, texto: string) {
    setPasos((p) => p.map((s) => (s.id === id ? { ...s, texto } : s)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!titulo || !descripcion || !categoria || !tiempoMin || !porciones || !dificultad) {
      setError('Completa todos los campos requeridos.');
      return;
    }
    if (ingredientes.some((i) => !i.nombre || !i.unidad || i.cantidad <= 0)) {
      setError('Revisa que todos los ingredientes estén completos.');
      return;
    }
    if (pasos.some((s) => !s.texto.trim())) {
      setError('Todos los pasos deben tener texto.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<{ receta: { _id: string } }>('/api/recetas', {
        titulo,
        descripcion,
        categoria,
        tiempoMin: Number(tiempoMin),
        porciones: Number(porciones),
        dificultad,
        imagenUrl,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        ingredientes: ingredientes.map(({ nombre, cantidad, unidad }) => ({ nombre, cantidad: Number(cantidad), unidad })),
        pasos: pasos.map((s) => s.texto.trim()),
      });
      navigate(`/recetas/${data.receta._id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Error al crear la receta.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-content">
      <div className="container recipe-form-page">
        <div className="recipe-form-page__header">
          <h1>Nueva receta</h1>
          <p>Comparte tu creación con la comunidad.</p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: 24 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="recipe-form">
            {/* Columna izquierda */}
            <div className="recipe-form__section">
              <p className="recipe-form__section-title">Información general</p>

              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Pasta al pesto con nueces" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <textarea className="form-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Un plato clásico que…" rows={3} required />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input className="form-input" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ej. Italiana, Postres, Vegana…" required />
              </div>
              <div className="time-portions-grid">
                <div className="form-group">
                  <label className="form-label">Tiempo (min) *</label>
                  <input className="form-input" type="number" min={1} value={tiempoMin} onChange={(e) => setTiempoMin(e.target.value)} placeholder="30" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Porciones *</label>
                  <input className="form-input" type="number" min={1} value={porciones} onChange={(e) => setPorciones(e.target.value)} placeholder="4" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dificultad *</label>
                <select className="form-select" value={dificultad} onChange={(e) => setDificultad(e.target.value as typeof dificultad)} required>
                  <option value="">Selecciona…</option>
                  {DIFICULTADES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Imagen de la receta</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="form-input" />
                  {isUploadingImage && <span className="form-hint">Subiendo imagen de forma segura...</span>}
                  {imageError && (
                    <span className="form-hint" style={{ color: '#d32f2f' }}>
                      {imageError}
                    </span>
                  )}

                  <div className="image-url-row">
                    <span className="form-hint">O pega un enlace:</span>
                    <input className="form-input" style={{ flex: 1 }} type="url" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://…" />
                  </div>
                </div>
                {imagenUrl && (
                  <div style={{ marginTop: '12px' }}>
                    <p className="form-hint" style={{ marginBottom: '4px' }}>
                      Vista previa:
                    </p>
                    <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Etiquetas</label>
                <input className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="italiana, pasta, vegetariana (separadas por coma)" />
                <span className="form-hint">Separa las etiquetas con comas.</span>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="recipe-form__section">
              {/* Ingredientes */}
              <div>
                <p className="recipe-form__section-title">Ingredientes *</p>
                <div className="dynamic-list" style={{ marginBottom: 12 }}>
                  {ingredientes.map((ing) => (
                    <div key={ing.id} className="dynamic-item">
                      <div className="ingredient-row">
                        <input className="form-input" placeholder="Nombre" value={ing.nombre} onChange={(e) => updateIngrediente(ing.id, 'nombre', e.target.value)} />
                        <input
                          className="form-input"
                          type="number"
                          min={0}
                          step="any"
                          placeholder="Cant."
                          value={ing.cantidad || ''}
                          onChange={(e) => updateIngrediente(ing.id, 'cantidad', parseFloat(e.target.value) || 0)}
                        />
                        <input className="form-input" placeholder="Unidad" value={ing.unidad} onChange={(e) => updateIngrediente(ing.id, 'unidad', e.target.value)} />
                      </div>
                      {ingredientes.length > 1 && (
                        <button type="button" className="btn-remove" onClick={() => removeIngrediente(ing.id)}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add-item" onClick={addIngrediente}>
                  + Agregar ingrediente
                </button>
              </div>

              {/* Pasos */}
              <div style={{ marginTop: 24 }}>
                <p className="recipe-form__section-title">Pasos de preparación *</p>
                <div className="dynamic-list" style={{ marginBottom: 12 }}>
                  {pasos.map((paso, idx) => (
                    <div key={paso.id} className="dynamic-item">
                      <span className="dynamic-item__number">{idx + 1}</span>
                      <textarea
                        className="form-textarea"
                        placeholder={`Paso ${idx + 1}…`}
                        value={paso.texto}
                        onChange={(e) => updatePaso(paso.id, e.target.value)}
                        rows={2}
                        style={{ flex: 1, minHeight: 64 }}
                      />
                      {pasos.length > 1 && (
                        <button type="button" className="btn-remove" onClick={() => removePaso(paso.id)}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add-item" onClick={addPaso}>
                  + Agregar paso
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: 40 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className={`btn btn-primary btn-lg${loading ? ' btn--loading' : ''}`} disabled={loading || isUploadingImage}>
              {loading || isUploadingImage ? <span className="btn__spinner" /> : 'Publicar receta'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
