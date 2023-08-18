import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import useEditorContext from './useEditorContext.js';
import {
    finishLoadingWorkspace,
    selectError,
    selectIsLoading,
    selectLoadingPath,
    selectWorkspacePath,
    startLoadingWorkspace
} from '../../model/workspaceSlice.js';

export default function useWorkspace() {
    let editorContext = useEditorContext();
    let dispatch = useDispatch();
    let workspacePath = useSelector(selectWorkspacePath);
    let loadingPath = useSelector(selectLoadingPath);
    let isLoading = useSelector(selectIsLoading);
    let error = useSelector(selectError);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (loadingPath === workspacePath) {
            return;
        }

        dispatch(startLoadingWorkspace(workspacePath));

        (async () => {

            try {
                let response = await editorContext.setWorkspacePath(workspacePath);

                if (response.status === 'OK') {
                    await editorContext.reloadDataFromServer();

                    dispatch(finishLoadingWorkspace());
                } else {
                    dispatch(finishLoadingWorkspace({
                        error: response,
                    }));
                }
            } catch (e) {
                try {
                    dispatch(finishLoadingWorkspace({
                        error: JSON.parse(e.message),
                    }));
                } catch (parseError) {
                    dispatch(finishLoadingWorkspace({
                        error: {
                            message: e.message,
                        },
                    }));
                }
            }
        })();
    }, [dispatch, editorContext, workspacePath, isLoading, loadingPath]);

    return {
        path: workspacePath,
        loadingPath,
        isLoading,
        error,
    };
}
