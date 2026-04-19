import { describe, expect, it } from 'vitest';
import { withFetch } from './with-fetch';

describe('withFetch', () => {
  it('should fetch data and add to context', async () => {
    const middleware = withFetch('user', async () => ({ name: 'Jean' }));

    const result = await middleware({}, undefined);

    expect(result).toStrictEqual({ ctx: { user: { name: 'Jean' } } });
  });

  it('should pass context to fetcher', async () => {
    const middleware = withFetch('greeting', async (ctx: { name: string }) => `Hello ${ctx.name}`);

    const result = await middleware({ name: 'Jean' }, undefined);

    expect(result).toStrictEqual({ ctx: { greeting: 'Hello Jean' } });
  });
});
