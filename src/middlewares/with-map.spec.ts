import { describe, expect, it } from 'vitest';
import { withMap } from './with-map';

describe('withMap', () => {
  it('should derive a value from context', async () => {
    const middleware = withMap('upper', (ctx: { name: string }) => ctx.name.toUpperCase());

    const result = await middleware({ name: 'jean' }, undefined);

    expect(result).toStrictEqual({ ctx: { upper: 'JEAN' } });
  });
});
