/* eslint-disable */
import { useRef, useMemo } from 'react';
import useUpdate from './useUpdate';

export interface StableActions<K> {
  clear: () => void;
  delete: (key: K) => void;
  toggle: (key: K) => void;
  reset: () => void;
}

export interface SetProxy<K> extends StableActions<K> {
  add: (key: K) => void;
  entries: () => Iterator<any, any, undefined>;
  values: () => Iterator<any, any, undefined>;
  forEach: (Function) => void;
  has: (key: K) => boolean;
  size: Number;
}

const useNativeSet = <K>(initialSet = new Set<K>()): [Set<K>, SetProxy<K>] => {
  const set = useRef(new Set(Array.from(initialSet)));
  const update = useUpdate();

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
        // update();
      },
      reset: () => {
        set.current = initialSet;
        update();
      },
      size: set.current.size,
      add: (item) => {
        set.current.add(item);
        // update();
      },
      entries: () => set.current.entries(),
      forEach: (fn = null) => set.current.forEach(fn),
      has: (item) => set.current.has(item),
      values: () => set.current.values(),
    } as SetProxy<K>;
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
