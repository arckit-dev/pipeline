import { describe, expect, it } from 'vitest';
import { actionBuilder, type PipeMiddleware } from './action-builder';
import type { ServerActionResult } from './result';

describe('actionBuilder', () => {
  it('should execute handler and return success', async () => {
    const action = actionBuilder().execute(async () => 'result');

    const result = await action();

    expect(result).toStrictEqual({ success: true, data: 'result' });
  });

  it('should return success with undefined data when handler returns void', async () => {
    const action = actionBuilder().execute(async () => undefined);

    const result = await action();

    expect(result).toStrictEqual({ success: true, data: undefined });
  });

  it('should pass through ServerActionResult from handler', async () => {
    const action = actionBuilder().execute(async () => ({ success: false, error: 'oops' }) as ServerActionResult<string>);

    const result = await action();

    expect(result).toStrictEqual({ success: false, error: 'oops' });
  });

  it('should apply middleware to context', async () => {
    const withName: PipeMiddleware<object, { name: string }, unknown> = async (_ctx, _raw, next) => next({ name: 'Jean' });

    const action = actionBuilder()
      .use(withName)
      .execute(async (ctx) => ctx.name);

    const result = await action();

    expect(result).toStrictEqual({ success: true, data: 'Jean' });
  });

  it('should catch errors and return failure', async () => {
    const action = actionBuilder().execute(async () => {
      throw new Error('boom');
    });

    const result = await action();

    expect(result.success).toBe(false);
  });

  it('should prefix errors when errorPrefix is set', async () => {
    const action = actionBuilder({ errorPrefix: 'ns' }).execute(async () => {
      throw 'err';
    });

    const result = await action();

    expect(result).toStrictEqual({ success: false, error: 'ns.err' });
  });

  it('should rethrow errors matching isRethrowableError', async () => {
    const specialError = new Error('redirect');
    const action = actionBuilder({
      isRethrowableError: (e) => e === specialError
    }).execute(async () => {
      throw specialError;
    });

    await expect(action()).rejects.toBe(specialError);
  });
});
