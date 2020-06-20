/* eslint-disable */
import { useRef, useReducer, useMemo } from 'react';
// import useUpdate from './useUpdate';

export interface StableActions<K> {
  clear: () => void;
  delete: (key: K) => void;
  toggle: (key: K) => void;
  reset: () => void;
}

export interface Actions<K> extends StableActions<K> {
  add: (key: K) => void;
  entries: () => Iterator<any, any, undefined>;
  values: () => Iterator<any, any, undefined>;
  forEach: (Function) => void;
  has: (key: K) => boolean;
  size: Number;
}

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

const useNativeSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const set = useRef(initialSet);
  const [, update] = useReducer(updateReducer, 0);

  // const stableActions = useMemo<StableActions<K>>(() => {
  //   // const add = (item: K) => setSet((prevSet) => new Set([...Array.from(prevSet), item]));
  //   const remove = (item: K) => setSet((prevSet) => new Set(Array.from(prevSet).filter((i) => i !== item)));
  //   const clear = () => set.clear();
  //   const toggle = (item: K) =>
  //     setSet((prevSet) =>
  //       prevSet.has(item)
  //         ? new Set(Array.from(prevSet).filter((i) => i !== item))
  //         : new Set([...Array.from(prevSet), item])
  //     );

  //   return {
  //     clear: clear,
  //     delete: remove,
  //     toggle: toggle,
  //     reset: () => set.current = initialSet,
  //   };
  // }, [set.current]);

  const proxy = useMemo(() => {
    return {
      clear: set.current.clear,
      delete: (item) => set.current.delete(item),
      toggle: (item) => {
        if (set.current.has(item)) {
          set.current.delete(item);
        } else {
          set.current.add(item);
        }
        update(1);
      },
      reset: () => {
        // set.current.clear();
        console.log(initialSet);
        set.current = initialSet;
        // update(1);
      },
      size: set.current.size,
      add: (item) => {
        set.current.add(item);
        update(1);
      },
      entries: () => set.current.entries(),
      forEach: (fn = null) => set.current.forEach(fn),
      has: (item) => set.current.has(item),
      values: () => set.current.values(),
    } as Actions<K>;
  }, [set.current]);

  return [set.current, proxy];
};

export default useNativeSet;

// add: expect.any(Function),
// clear: expect.any(Function),
// delete: expect.any(Function),
// entries: expect.any(Function),
// forEach: expect.any(Function),
// has: expect.any(Function),
// values: expect.any(Function),
// toggle: expect.any(Function),
// reset: expect.any(Function),
