import { PrimeraPalabraPipe } from './primera-palabra.pipe';

describe('PrimeraPalabraPipe', () => {
  it('create an instance', () => {
    const pipe = new PrimeraPalabraPipe();
    expect(pipe).toBeTruthy();
  });
});
