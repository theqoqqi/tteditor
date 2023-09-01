import useCompositeObserver from './useCompositeObserver';

export default function useListObserver(target, propertyPath) {
    let state = useCompositeObserver(target, propertyPath, true);

    return [state.value, state.added, state.removed];
}
