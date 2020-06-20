# `useNativeSet`

React state hook that wraps a native [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

## Usage

```jsx
import { useNativeSet } from 'react-use';

const Demo = () => {
  const [set, { size, add, delete, toggle, clear, entries, has, values }] = useNativeSet(new Set(['hello']));

  return (
    <div>
      <button onClick={() => add(String(Date.now()))}>Add</button>
      <button onClick={() => reset()}>Reset</button>
      <button onClick={() => remove('hello')} disabled={!has('hello')}>
        Remove 'hello'
      </button>
      <button onClick={() => toggle('hello')}>Toggle hello</button>
      <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
    </div>
  );
};
```
