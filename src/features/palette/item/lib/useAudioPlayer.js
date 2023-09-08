import {useCallback, useEffect, useState} from 'react';

export default function useAudioPlayer() {
    let [audio, setAudio] = useState(null);

    let playAudio = useCallback(audioSrc => {
        if (audio) {
            audio.pause();
        }

        setAudio(new Audio(audioSrc));
    }, [audio]);

    useEffect(() => {
        audio?.play();
    }, [audio]);

    return {
        play: playAudio,
    };
}
