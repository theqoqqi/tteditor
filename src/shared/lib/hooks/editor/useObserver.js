import useCompositeObserver, {useTargetArray} from './useCompositeObserver';

export default function useObserver(targets, propertyPath) {
    let targetArray = useTargetArray(targets);
    let state = useCompositeObserver(targetArray, propertyPath, false);

    return Array.isArray(targets)
        ? state.values
        : state.values[0];
}
