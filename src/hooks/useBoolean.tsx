import { useState, Dispatch, SetStateAction } from 'react';

interface UseBooleanActions {
  set: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export default function useBoolean(defaultValue: boolean = false): [boolean, UseBooleanActions] {
  const [value, setValue] = useState<boolean>(defaultValue);
  return [
    value,
    {
      set: setValue,
      toggle: () => setValue((x) => !x),
      setTrue: () => setValue(true),
      setFalse: () => setValue(false),
    },
  ];
}
