import { describe, it, expect } from 'vitest';
import { generateGradientCss, getDefaultGradient } from '../engine/gradientEngine';

describe('Gradient Studio Engine', () => {
  it('generates valid CSS linear gradient syntax', () => {
    const gradient = getDefaultGradient();
    const css = generateGradientCss(gradient);
    expect(css).toContain('linear-gradient(135deg');
    expect(css).toContain('#A78BFA 0%');
  });

  it('generates valid CSS radial gradient syntax', () => {
    const gradient = {
      ...getDefaultGradient(),
      type: 'radial' as const,
      shape: 'circle' as const,
    };
    const css = generateGradientCss(gradient);
    expect(css).toContain('radial-gradient(circle at center');
  });

  it('clamps stop positions between 0 and 100 gracefully in CSS output', () => {
    const gradient = {
      ...getDefaultGradient(),
      stops: [
        { id: '1', color: '#111111', position: -25 },
        { id: '2', color: '#FFFFFF', position: 175 },
      ],
    };
    const css = generateGradientCss(gradient);
    expect(css).toContain('#111111 0%');
    expect(css).toContain('#FFFFFF 100%');
  });
});
