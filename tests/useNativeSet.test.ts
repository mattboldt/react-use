import { act, renderHook } from '@testing-library/react-hooks';
import useNativeSet from '../src/useNativeSet';

const setUp = <K>(initialSet?: Set<K>) => renderHook(() => useNativeSet(initialSet));

it('should init set and utils', () => {
  const { result } = setUp(new Set([1, 2]));
  const [set, utils] = result.current;

  expect(set).toEqual(new Set([1, 2]));
  expect(utils).toHaveProperty('size');
  expect(utils).toStrictEqual({
    size: expect.any(Number),
    add: expect.any(Function),
    clear: expect.any(Function),
    delete: expect.any(Function),
    entries: expect.any(Function),
    forEach: expect.any(Function),
    has: expect.any(Function),
    values: expect.any(Function),
    toggle: expect.any(Function),
    reset: expect.any(Function),
  });
});

it('should init empty set if no initial set provided', () => {
  const { result } = setUp();

  expect(result.current[0]).toEqual(new Set());
});

it('should have an initially provided key', () => {
  const { result } = setUp(new Set(['a']));
  const [, utils] = result.current;

  let value;
  act(() => {
    value = utils.has('a');
  });

  expect(value).toBe(true);
});

it('should have an added key', () => {
  const { result } = setUp(new Set());

  act(() => {
    result.current[1].add('newKey');
  });

  let value;
  act(() => {
    value = result.current[1].has('newKey');
  });

  expect(value).toBe(true);
});

it('should get false for non-existing key', () => {
  const { result } = setUp(new Set(['a']));
  const [, utils] = result.current;

  let value;
  act(() => {
    value = utils.has('nonExisting');
  });

  expect(value).toBe(false);
});

it('should add a new key', () => {
  const { result } = setUp(new Set(['oldKey']));
  const [, utils] = result.current;

  act(() => {
    utils.add('newKey');
  });

  expect(result.current[0]).toEqual(new Set(['oldKey', 'newKey']));
});

it('should work if setting existing key', () => {
  const { result } = setUp(new Set(['oldKey']));
  const [, utils] = result.current;

  act(() => {
    utils.add('oldKey');
  });

  expect(result.current[0]).toEqual(new Set(['oldKey']));
});

it('should delete existing key', () => {
  const { result } = setUp(new Set([1, 2]));
  const [, utils] = result.current;

  act(() => {
    utils.delete(2);
  });

  expect(result.current[0]).toEqual(new Set([1]));
});

it('should delete an existing key on toggle', () => {
  const { result } = setUp(new Set([1, 2]));
  const [, utils] = result.current;

  act(() => {
    utils.toggle(2);
  });

  expect(result.current[0]).toEqual(new Set([1]));
});

it('should add a new key on toggle', () => {
  const { result } = setUp(new Set([1]));
  const [, utils] = result.current;

  act(() => {
    utils.toggle(2);
  });

  expect(result.current[0]).toEqual(new Set([1, 2]));
});

it('should do nothing if removing non-existing key', () => {
  const { result } = setUp(new Set(['a', 'b']));
  const [, utils] = result.current;

  act(() => {
    utils.delete('nonExisting');
  });

  expect(result.current[0]).toEqual(new Set(['a', 'b']));
});

it('should reset to initial set provided', () => {
  const { result } = setUp(new Set([1]));
  const [, utils] = result.current;

  act(() => {
    utils.add(2);
  });

  expect(result.current[0]).toEqual(new Set([1, 2]));

  act(() => {
    utils.reset();
  });

  expect(result.current[0]).toEqual(new Set([1]));
});

it('should memoized its utils methods', () => {
  const { result } = setUp(new Set(['a', 'b']));
  const [, utils] = result.current;

  act(() => {
    utils.add('foo');
  });

  expect(result.current[1].add).toBe(utils.add);
  expect(result.current[1].delete).toBe(utils.delete);
  expect(result.current[1].toggle).toBe(utils.toggle);
  expect(result.current[1].reset).toBe(utils.reset);
});
