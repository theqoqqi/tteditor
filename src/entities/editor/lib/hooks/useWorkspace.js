import {useSelector} from 'react-redux';
import {selectError, selectIsLoading, selectLoadingPath, selectWorkspacePath} from '../../model/workspaceSlice.js';

export default function useWorkspace() {
    let workspacePath = useSelector(selectWorkspacePath);
    let loadingPath = useSelector(selectLoadingPath);
    let isLoading = useSelector(selectIsLoading);
    let error = useSelector(selectError);

    return {
        workspacePath,
        loadingPath,
        isLoading,
        error,
    };
}
