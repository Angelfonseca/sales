## Installation

```bash
$ npm install --save-dev @babel/core @babel/preset-env
```

## Usage

```js
import { transform } from '@babel/core';
import { env } from '@babel/preset-env';

const code = `
  import { foo } from 'bar';
  console.log(foo);
`;

const result = transform(code, {
  presets: [env({ targets: { node: 'current' } })],
});
```

## License

MIT © [David Khourshid](https://github.com/davidkpiano)