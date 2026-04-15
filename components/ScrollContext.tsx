"use client";

import { createContext, useContext, useRef } from "react";

type ScrollContextValue = React.MutableRefObject<number>;

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scroll = useRef(0);

  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>;
}

export function useScrollValue() {
  const scroll = useContext(ScrollContext);

  if (!scroll) {
    throw new Error("useScrollValue must be used within ScrollProvider");
  }

  return scroll;
}
