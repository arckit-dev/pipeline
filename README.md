# @arckit/pipeline

Type-safe middleware pipeline builder with parallel execution and React provider wrapping.

[![npm version](https://img.shields.io/npm/v/@arckit/pipeline)](https://www.npmjs.com/package/@arckit/pipeline)
[![npm downloads](https://img.shields.io/npm/dm/@arckit/pipeline)](https://www.npmjs.com/package/@arckit/pipeline)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@arckit/pipeline)](https://bundlephobia.com/package/@arckit/pipeline)
[![codecov](https://codecov.io/gh/arckit-dev/pipeline/graph/badge.svg)](https://codecov.io/gh/arckit-dev/pipeline)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 📑 Table of Contents

- 🪧 [About](#about)
- 📦 [Installation](#installation)
- 🚀 [Usage](#usage)
- 📖 [API](#api)
- 🤗 [Contributing](#contributing)
- 📝 [License](#license)

<h2 id="about">🪧 About</h2>

Framework-agnostic middleware pipeline engine. Provides the core execution model used by page, layout, action, and route builders. Supports sequential and parallel middleware execution, typed context accumulation, and React provider wrapping.

<h2 id="installation">📦 Installation</h2>

```bash
pnpm add @arckit/pipeline
```

<h2 id="usage">🚀 Usage</h2>

### Render pipeline (pages, layouts)

```typescript
import { render, withFetch, withMap } from '@arckit/pipeline';

const middlewares = [
  withFetch('users', async () => fetchUsers()),
  withMap('count', ({ users }) => users.length)
];

const page = render(middlewares)(async ({ users, count }, props) => (
  <UserList users={users} count={count} />
));
```

### Action builder (server actions)

```typescript
import { actionBuilder } from '@arckit/pipeline/action';

const myAction = actionBuilder()
  .use(withInput(schema))
  .execute(async ({ input }) => doSomething(input));
```

### Effect integration (optional)

```typescript
import { fromEither } from '@arckit/pipeline/effect';

const myAction = actionBuilder()
  .execute(fromEither(
    async ({ input }) => createUser(input),
    { onError: { UserAlreadyExists: 'error.exists' } }
  ));
```

<h2 id="api">📖 API</h2>

### Core (`@arckit/pipeline`)

| Export | Description |
|--------|-------------|
| `render(middlewares)` | Creates an execution function from a middleware array. Handles sequential/parallel execution and provider wrapping. |
| `applyProviders(providers, content)` | Wraps React content with provider components. |
| `withFetch(key, fetcher)` | Middleware: fetches async data into context. |
| `withMap(key, mapper)` | Middleware: derives a synchronous value into context. |

### Action (`@arckit/pipeline/action`)

| Export | Description |
|--------|-------------|
| `actionBuilder(options?)` | Creates a pipe-based middleware builder for server actions. |
| `ServerActionSuccess(data?)` | Constructs a success result. |
| `ServerActionError(error)` | Constructs an error result. |
| `PipeMiddleware<In, Out, Result, Error>` | Type for action pipe middlewares. |

Options:
- `errorPrefix` — Prefix prepended to error strings.
- `isRethrowableError` — Predicate for errors that should be rethrown (e.g., Next.js redirect errors).

### Effect (`@arckit/pipeline/effect`)

| Export | Description |
|--------|-------------|
| `fromEither(handler, options)` | Converts an Effect `Either` result into a `ServerActionResult` with error mapping. |

<h2 id="contributing">🤗 Contributing</h2>

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

<h2 id="license">📝 License</h2>

[MIT](LICENSE) &copy; Marc Gavanier
