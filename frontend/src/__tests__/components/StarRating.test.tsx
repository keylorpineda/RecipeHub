import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '../../components/StarRating';

describe('StarRating', () => {
  it('renders exactly 5 stars', () => {
    render(<StarRating value={0} />);
    // Each star renders the ★ character
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('marks the correct number of filled stars for value=3', () => {
    render(<StarRating value={3} />);
    const stars = screen.getAllByText('★');
    const filled = stars.filter((s) => s.className.includes('star--filled'));
    expect(filled).toHaveLength(3);
  });

  it('marks all 5 stars filled for value=5', () => {
    render(<StarRating value={5} />);
    const stars = screen.getAllByText('★');
    const filled = stars.filter((s) => s.className.includes('star--filled'));
    expect(filled).toHaveLength(5);
  });

  it('marks no stars filled for value=0', () => {
    render(<StarRating value={0} />);
    const stars = screen.getAllByText('★');
    const filled = stars.filter((s) => s.className.includes('star--filled'));
    expect(filled).toHaveLength(0);
  });

  it('calls onChange with the correct rating when a star is clicked', () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);
    const stars = screen.getAllByText('★');
    // Click the 4th star
    fireEvent.click(stars[3]);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with 1 when the first star is clicked', () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);
    const stars = screen.getAllByText('★');
    fireEvent.click(stars[0]);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('does not call onChange when no onChange prop is provided (display only)', () => {
    // Just verify click doesn't throw when no handler is supplied
    render(<StarRating value={3} />);
    const stars = screen.getAllByText('★');
    expect(() => fireEvent.click(stars[0])).not.toThrow();
  });

  it('renders as a radiogroup when interactive', () => {
    const handleChange = vi.fn();
    const { container } = render(<StarRating value={2} onChange={handleChange} />);
    expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
  });
});
