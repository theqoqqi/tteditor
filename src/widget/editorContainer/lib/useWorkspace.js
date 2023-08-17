import {selectWorkspacePath, useEditorContext} from '../../../entities/editor';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';

export default function useWorkspace() {
    let editorContext = useEditorContext();
    let workspacePath = useSelector(selectWorkspacePath);
    let dispatch = useDispatch();
    let [startedWorkspace, setStartedWorkspace] = useState(null);
    let [loadedWorkspace, setLoadedWorkspace] = useState(null);
    let [isLoading, setIsLoading] = useState(false);
    let [error, setError] = useState(null);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (startedWorkspace === workspacePath) {
            return;
        }

        setIsLoading(true);
        setLoadedWorkspace(null);
        setError(null);
        setStartedWorkspace(workspacePath);

        (async () => {

            try {
                let response = await editorContext.setWorkspacePath(workspacePath);

                if (response.status === 'OK') {
                    await editorContext.reloadDataFromServer();

                    setLoadedWorkspace(workspacePath);
                } else {
                    setError(response);
                }
            } catch (e) {
                try {
                    setError(JSON.parse(e.message));
                } catch (parseError) {
                    setError({
                        message: e.message,
                    });
                }
            }

            setIsLoading(false);
        })();
    }, [dispatch, editorContext, workspacePath, isLoading, loadedWorkspace, startedWorkspace]);

    return {
        path: loadedWorkspace,
        isLoading,
        error,
    };
}
