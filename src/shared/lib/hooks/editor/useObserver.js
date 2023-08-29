import useCompositeObserver from './useCompositeObserver.js';

export default function useObserver(target, propertyPath) {
    let state = useCompositeObserver(target, propertyPath, false);

    return state.value;
}
