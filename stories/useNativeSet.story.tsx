import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { useNativeSet } from '../src';
import ShowDocs from './util/ShowDocs';

const Demo = () => {
  const [set, { add, has, remove, reset, toggle }] = useNativeSet(new Set(['hello']));

  return (
    <div>
      <button onClick={() => add(String(Date.now()))}>Add</button>
      <button onClick={() => reset()}>Reset</button>
      <button onClick={() => remove('hello')} disabled={!has('hello')}>
        Remove 'hello'
      </button>
      <button onClick={() => toggle('hello')}>Toggle 'hello'</button>
      <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
    </div>
  );
};

storiesOf('State|useNativeSet', module)
  .add('Docs', () => <ShowDocs md={require('../docs/useNativeSet.md')} />)
  .add('Demo', () => <Demo />);
