import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import type { IRecipe, IIngrediente } from '../types';

interface IngredienteRow extends IIngrediente {
  id: number;
}

const DIFICULTADES = ['Fácil', 'Media', 'Difícil'] as const;

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tiempoMin, setTiempoMin] = useState('');
  const [porciones, setPorciones] = useState('');
  const [dificultad, setDificultad] = useState<'Fácil' | 'Media' | 'Difícil' | ''>('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [tags, setTags] = useState('');
  const [ingredientes, setIngredientes] = useState<IngredienteRow[]>([]);
  const [pasos, setPasos] = useState<{ id: number; texto: string }[]>([]);
  const [nextId, setNextId] = useState(100);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ receta: IRecipe }>(`/api/recetas/${id}`)
      .then(({ data }) => {
        const r = data.receta;
        setTitulo(r.titulo);
        setDescripcion(r.descripcion);
        setCategoria(r.categoria);
        setTiempoMin(String(r.tiempoMin));
        setPorciones(String(r.porciones));
        setDificultad(r.dificultad);
        setImagenUrl(r.imagenUrl);
        setTags(r.tags.join(', '));
        setIngredientes(r.ingredientes.map((ing, i) => ({ ...ing, id: i })));
        setPasos(r.pasos.map((texto, i) => ({ id: i, texto })));
        setNextId(r.pasos.length + r.ingredientes.length + 10);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function addIngrediente() {
    setIngredientes((p) => [...p, { id: nextId, nombre: '', cantidad: 0, unidad: '' }]);
    setNextId((n) => n + 1);
  }
  function removeIngrediente(rowId: number) {
    setIngredientes((p) => p.filter((i) => i.id !== rowId));
  }
  function updateIngrediente(rowId: number, field: keyof IIngrediente, value: string | number) {
    setIngredientes((p) => p.map((i) => (i.id === rowId ? { ...i, [field]: value } : i)));
  }
  function addPaso() {
    setPasos((p) => [...p, { id: nextId, texto: '' }]);
    setNextId((n) => n + 1);
  }
  function removePaso(rowId: number) {
    setPasos((p) => p.filter((s) => s.id !== rowId));
  }
  function updatePaso(rowId: number, texto: string) {
    setPasos((p) => p.map((s) => (s.id === rowId ? { ...s, texto } : s)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!titulo || !descripcion || !categoria || !tiempoMin || !porciones || !dificultad) {
      setError('Completa todos los campos requeridos.');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/api/recetas/${id}`, {
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
      navigate(`/recetas/${id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Error al guardar los cambios.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading__spinner" />
        <span>Cargando receta…</span>
      </div>
    );
  }

  return (
    <main className="page-content">
      <div className="container recipe-form-page">
        <div className="recipe-form-page__header">
          <h1>Editar receta</h1>
          <p>Actualiza los detalles de tu publicación.</p>
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
                <input className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <textarea className="form-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} required />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input className="form-input" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
              </div>
              <div className="time-portions-grid">
                <div className="form-group">
                  <label className="form-label">Tiempo (min) *</label>
                  <input className="form-input" type="number" min={1} value={tiempoMin} onChange={(e) => setTiempoMin(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Porciones *</label>
                  <input className="form-input" type="number" min={1} value={porciones} onChange={(e) => setPorciones(e.target.value)} required />
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
                <label className="form-label">URL de imagen</label>
                <input className="form-input" type="url" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Etiquetas</label>
                <input className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="italiana, pasta, vegana…" />
                <span className="form-hint">Separadas por coma.</span>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="recipe-form__section">
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

              <div style={{ marginTop: 24 }}>
                <p className="recipe-form__section-title">Pasos de preparación *</p>
                <div className="dynamic-list" style={{ marginBottom: 12 }}>
                  {pasos.map((paso, idx) => (
                    <div key={paso.id} className="dynamic-item">
                      <span className="dynamic-item__number">{idx + 1}</span>
                      <textarea className="form-textarea" value={paso.texto} onChange={(e) => updatePaso(paso.id, e.target.value)} rows={2} style={{ flex: 1, minHeight: 64 }} />
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
            <button type="button" className="btn btn-ghost" onClick={() => navigate(`/recetas/${id}`)}>
              Cancelar
            </button>
            <button type="submit" className={`btn btn-primary btn-lg${saving ? ' btn--loading' : ''}`} disabled={saving}>
              {saving ? <span className="btn__spinner" /> : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
