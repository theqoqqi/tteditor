import {useCallback, useEffect, useState} from 'react';
import {useDebounce} from 'react-use';

export default function useDebouncedOnChange({ storedValue, millis, shouldDebounce, onChange }) {

    let [inputValue, setInputValue] = useState(storedValue);
    let [event, setEvent] = useState(null);

    let onInputChange = useCallback(e => {
        if (!shouldDebounce(e)) {
            onChange(e.target.value, storedValue, e);
            return;
        }

        setInputValue(e.target.value);
        setEvent(e);
    }, [onChange, shouldDebounce, storedValue]);

    useDebounce(() => {
        if (event) {
            onChange(inputValue, storedValue, event);
            setEvent(null);
        }
    }, millis, [onChange, storedValue, event]);

    useEffect(() => {
        if (event === null) {
            setInputValue(storedValue);
        }
    }, [event, storedValue]);

    return [inputValue, onInputChange];
}
