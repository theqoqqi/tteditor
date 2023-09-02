import {useIntersection} from 'react-use';
import {useEffect, useState} from 'react';

export default function useFirstIntersection(ref, callback, deps = []) {
    let intersection = useIntersection(ref, {});
    let [passed, setPassed] = useState(false);

    useEffect(() => {
        if (!passed && intersection && intersection.isIntersecting) {
            callback();
            setPassed(true);
        }
    }, [intersection, callback, passed, deps]);
}