import { useEffect, useRef } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Custom hook that triggers a handler function when clicking outside of the referenced element
 * @param handler - Function to call when clicking outside
 * @param listenCapturing - Whether to listen during the capturing phase (default: true)
 * @returns ref - Ref object to attach to the element you want to detect outside clicks for
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  listenCapturing: boolean = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener("mousedown", listener, listenCapturing);
    document.addEventListener("touchstart", listener, listenCapturing);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener("mousedown", listener, listenCapturing);
      document.removeEventListener("touchstart", listener, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return ref;
}

// Alternative version with multiple refs support
export function useOnClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  listenCapturing: boolean = true
) {
  const refs = useRef<T[]>([]);

  const addRef = (el: T | null) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  const removeRef = (el: T | null) => {
    if (el) {
      refs.current = refs.current.filter((ref) => ref !== el);
    }
  };

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside all referenced elements
      const isOutside = refs.current.every(
        (el) => !el || !el.contains(event.target as Node)
      );

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener, listenCapturing);
    document.addEventListener("touchstart", listener, listenCapturing);

    return () => {
      document.removeEventListener("mousedown", listener, listenCapturing);
      document.removeEventListener("touchstart", listener, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return { addRef, removeRef };
}
