import useCompositeObserver from './useCompositeObserver';

export default function useObserver(target, propertyPath) {
    let state = useCompositeObserver(target, propertyPath, false);

    return state.value;
}
