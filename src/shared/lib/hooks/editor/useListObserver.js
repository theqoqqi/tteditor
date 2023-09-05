import useCompositeObserver, {useTargetArray} from './useCompositeObserver';

export default function useListObserver(targets, propertyPath) {
    let targetArray = useTargetArray(targets);
    let state = useCompositeObserver(targetArray, propertyPath, true);

    return Array.isArray(targets)
        ? [state.values, state.addedArrays, state.removedArrays]
        : [state.values[0], state.addedArrays[0], state.removedArrays[0]];
}
