import { useState, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { IIngrediente } from '../types';
import CustomSelect from '../components/CustomSelect';
import { CATEGORIAS, DIFICULTADES, UNIDADES } from '../constants/recipeOptions';

interface IngredienteRow extends IIngrediente {
  id: number;
}

const emptyIng = (id: number): IngredienteRow => ({ id, nombre: '', cantidad: 0, unidad: '' });

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

  // Refs para hacer scroll a cada campo requerido
  const tituloRef = useRef<HTMLInputElement>(null);
  const descripcionRef = useRef<HTMLTextAreaElement>(null);
  const categoriaRef = useRef<HTMLDivElement>(null);
  const tiempoRef = useRef<HTMLInputElement>(null);
  const porcionesRef = useRef<HTMLInputElement>(null);
  const dificultadRef = useRef<HTMLDivElement>(null);

  function scrollToField(ref: React.RefObject<HTMLElement | null>, msg: string, focus = true) {
    setError(msg);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (focus) (ref.current as HTMLElement | null)?.focus?.();
    }, 50);
  }

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

    // Validación campo por campo con scroll al faltante
    if (!titulo.trim()) {
      scrollToField(tituloRef, 'El título de la receta es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      scrollToField(descripcionRef, 'La descripción es obligatoria.');
      return;
    }
    if (!categoria) {
      scrollToField(categoriaRef, 'Selecciona una categoría.', false);
      return;
    }
    if (!tiempoMin || Number(tiempoMin) <= 0) {
      scrollToField(tiempoRef, 'El tiempo de preparación es obligatorio.');
      return;
    }
    if (!porciones || Number(porciones) <= 0) {
      scrollToField(porcionesRef, 'El número de porciones es obligatorio.');
      return;
    }
    if (!dificultad) {
      scrollToField(dificultadRef, 'Selecciona la dificultad de la receta.', false);
      return;
    }
    if (ingredientes.some((i) => !i.nombre || !i.unidad || i.cantidad <= 0)) {
      setError('Revisa que todos los ingredientes estén completos (nombre, cantidad y unidad).');
      document.getElementById('ingredientes-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (pasos.some((s) => !s.texto.trim())) {
      setError('Todos los pasos deben tener texto.');
      document.getElementById('pasos-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="recipe-form">
            {/* Columna izquierda */}
            <div className="recipe-form__section">
              <p className="recipe-form__section-title">Información general</p>

              <div className="form-group">
                <label className="form-label" htmlFor="field-titulo">
                  Título *
                </label>
                <input id="field-titulo" ref={tituloRef} className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Pasta al pesto con nueces" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-descripcion">
                  Descripción *
                </label>
                <textarea
                  id="field-descripcion"
                  ref={descripcionRef}
                  className="form-textarea"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Un plato clásico que…"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <div ref={categoriaRef}>
                  <CustomSelect
                    id="field-categoria"
                    value={categoria}
                    onChange={setCategoria}
                    options={[{ value: '', label: 'Selecciona una categoría…' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]}
                  />
                </div>
              </div>

              <div className="time-portions-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="field-tiempo">
                    Tiempo (min) *
                  </label>
                  <input id="field-tiempo" ref={tiempoRef} className="form-input" type="number" min={1} value={tiempoMin} onChange={(e) => setTiempoMin(e.target.value)} placeholder="30" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="field-porciones">
                    Porciones *
                  </label>
                  <input id="field-porciones" ref={porcionesRef} className="form-input" type="number" min={1} value={porciones} onChange={(e) => setPorciones(e.target.value)} placeholder="4" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dificultad *</label>
                <div ref={dificultadRef}>
                  <CustomSelect
                    id="field-dificultad"
                    value={dificultad}
                    onChange={(v) => setDificultad(v as typeof dificultad)}
                    options={[{ value: '', label: 'Selecciona…' }, ...DIFICULTADES.map((d) => ({ value: d, label: d }))]}
                  />
                </div>
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
              <div id="ingredientes-section">
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
                        <CustomSelect value={ing.unidad} onChange={(val) => updateIngrediente(ing.id, 'unidad', val)} options={UNIDADES} triggerClassName="custom-select-trigger--compact" />
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
              <div id="pasos-section" style={{ marginTop: 24 }}>
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
