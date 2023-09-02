import {useIntersection} from 'react-use';
import React, {useEffect, useState} from 'react';

export default function useFirstIntersection(callback, deps = []) {
    const ref = React.useRef(null);
    let intersection = useIntersection(ref, {});
    let [passed, setPassed] = useState(false);

    useEffect(() => {
        if (!passed && intersection && intersection.isIntersecting) {
            callback();
            setPassed(true);
        }
    }, [intersection, callback, passed, deps]);

    return ref;
}