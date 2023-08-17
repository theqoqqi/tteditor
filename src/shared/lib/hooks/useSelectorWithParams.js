import {useSelector} from 'react-redux';

export default function useSelectorWithParams(selector, ...params) {
    return useSelector(state => selector(state, ...params));
}
