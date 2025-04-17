import { useEffect, useRef } from 'react';

/**
 * A hook that runs the effect only when the specified dependency changes,
 * not on every render or mount.
 * 
 * @param effect The effect function to run
 * @param dependency The dependency to watch for changes
 */
export function useEffectOnDependencyChange(
    effect: () => void | (() => void),
    dependency: any
) {
    const previousDependencyRef = useRef<any>();

    useEffect(() => {
        // Compare current dependency with the previous value
        const hasChanged =
            previousDependencyRef.current !== undefined &&
            previousDependencyRef.current !== dependency;

        // Store the current dependency for next comparison
        previousDependencyRef.current = dependency;

        // Only run effect if dependency has actually changed (not on first render)
        if (hasChanged) {
            return effect();
        }
        // We specifically want to depend only on the dependency parameter
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependency]);
}

/**
 * A variation that runs the effect on first render and then only
 * when the dependency changes.
 */
export function useEffectOnMountAndDependencyChange(
    effect: () => void | (() => void),
    dependency: any
) {
    const isFirstRenderRef = useRef(true);
    const previousDependencyRef = useRef<any>();

    useEffect(() => {
        // Run on first render
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            previousDependencyRef.current = dependency;
            return effect();
        }

        // Run when dependency changes
        if (previousDependencyRef.current !== dependency) {
            previousDependencyRef.current = dependency;
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependency]);
}