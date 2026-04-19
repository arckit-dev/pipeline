import { describe, expect, it } from 'vitest';
import { render } from './execution';

const toHtml = (value: string) => `<div>${value}</div>`;

describe('render', () => {
  it('should execute handler with empty middlewares', async () => {
    const page = render<object, string>([])(async (_ctx, extra) => toHtml(extra));

    const result = await page('hello');

    expect(result).toBe('<div>hello</div>');
  });

  it('should accumulate context from sequential middlewares', async () => {
    const middlewares = [async () => ({ ctx: { a: 1 } }), async () => ({ ctx: { b: 2 } })];

    const page = render<{ a: number; b: number }, undefined>(middlewares)(async (ctx) => toHtml(`${ctx.a + ctx.b}`));

    const result = await page(undefined);

    expect(result).toBe('<div>3</div>');
  });

  it('should execute parallel middlewares', async () => {
    const middlewares = [[async () => ({ ctx: { a: 1 } }), async () => ({ ctx: { b: 2 } })]];

    const page = render<{ a: number; b: number }, undefined>(middlewares)(async (ctx) => toHtml(`${ctx.a + ctx.b}`));

    const result = await page(undefined);

    expect(result).toBe('<div>3</div>');
  });

  it('should pass extra to middlewares', async () => {
    const middlewares = [async (_ctx: Record<string, unknown>, extra: unknown) => ({ ctx: { value: extra as string } })];

    const page = render<{ value: string }, string>(middlewares)(async (ctx) => toHtml(ctx.value));

    const result = await page('from-extra');

    expect(result).toBe('<div>from-extra</div>');
  });

  it('should merge context from sequential and parallel middlewares', async () => {
    const middlewares = [async () => ({ ctx: { a: 1 } }), [async () => ({ ctx: { b: 2 } }), async () => ({ ctx: { c: 3 } })]];

    const page = render<{ a: number; b: number; c: number }, undefined>(middlewares)(async (ctx) =>
      toHtml(`${ctx.a + ctx.b + ctx.c}`)
    );

    const result = await page(undefined);

    expect(result).toBe('<div>6</div>');
  });

  it('should collect providers from sequential middlewares', async () => {
    const MockProvider = ({ children, value }: { children: unknown; value: string }) => `[${value}]${children}[/${value}]`;

    const middlewares = [
      async () => ({
        ctx: {},
        provider: { component: MockProvider as Parameters<typeof render>[0][0], props: { value: 'wrap' } }
      })
    ];

    const page = render<object, undefined>(middlewares)(async () => 'content');

    const result = await page(undefined);

    expect(result).not.toBe('content');
  });

  it('should collect providers from parallel middlewares', async () => {
    const MockProvider = ({ children, value }: { children: unknown; value: string }) => `[${value}]${children}[/${value}]`;

    const middlewares = [
      [
        async () => ({
          ctx: { a: 1 },
          provider: { component: MockProvider as Parameters<typeof render>[0][0], props: { value: 'parallel' } }
        })
      ]
    ];

    const page = render<object, undefined>(middlewares)(async () => 'content');

    const result = await page(undefined);

    expect(result).not.toBe('content');
  });
});
