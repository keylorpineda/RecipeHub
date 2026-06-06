import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';

const baseProps = {
  _id: 'abc123',
  titulo: 'Pasta Carbonara',
  imagenUrl: 'https://example.com/pasta.jpg',
  tiempoMin: 30,
  dificultad: 'Media' as const,
  categoria: 'Italiana',
  descripcion: 'Una receta deliciosa de pasta.',
  porciones: 2,
};

function renderCard(overrides = {}) {
  return render(
    <MemoryRouter>
      <RecipeCard {...baseProps} {...overrides} />
    </MemoryRouter>,
  );
}

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    renderCard();
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
  });

  it('renders the preparation time in minutes', () => {
    renderCard();
    expect(screen.getByText(/30 min/i)).toBeInTheDocument();
  });

  it('renders the difficulty badge', () => {
    renderCard();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('renders the category label', () => {
    renderCard();
    expect(screen.getByText('Italiana')).toBeInTheDocument();
  });

  it('renders an <img> when imagenUrl is provided', () => {
    renderCard();
    const img = screen.getByRole('img', { name: /pasta carbonara/i });
    expect(img).toHaveAttribute('src', 'https://example.com/pasta.jpg');
  });

  it('renders the placeholder emoji when imagenUrl is empty', () => {
    renderCard({ imagenUrl: '' });
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('has a link pointing to the correct detail route /recetas/:id', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /ver receta: pasta carbonara/i });
    expect(link).toHaveAttribute('href', '/recetas/abc123');
  });

  it('renders the description when provided', () => {
    renderCard();
    expect(screen.getByText('Una receta deliciosa de pasta.')).toBeInTheDocument();
  });

  it('does not render a rating badge when no comentarios are provided', () => {
    renderCard();
    expect(screen.queryByText(/★\s[\d.]/)).toBeNull();
  });

  it('renders a rating badge when comentarios are provided', () => {
    renderCard({
      comentarios: [{ calificacion: 5 }, { calificacion: 4 }],
    });
    // avgRating → "4.5" — badge text is "★ 4.5"
    expect(screen.getByText(/★/)).toBeInTheDocument();
  });
});
