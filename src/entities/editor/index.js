import useMap from './lib/hooks/useMap.js';
import useEditor from './lib/hooks/useEditor.js';
import useEditorContext from './lib/hooks/useEditorContext.js';
import useRenderContext from './lib/hooks/useRenderContext.js';
import useWorkspace from './lib/hooks/useWorkspace.js';
import usePointerMode from './lib/hooks/usePointerMode.js';
import useNodeXml from './lib/hooks/useNodeXml.js';
import useObserver from './lib/hooks/useObserver.js';
import useListObserver from './lib/hooks/useListObserver.js';
import useMapObserver from './lib/hooks/useMapObserver.js';
import useEditorObserver from './lib/hooks/useEditorObserver.js';
import EditorProvider from './lib/provider.js';
import {
    addToSelection,
    clearSelection,
    removeFromSelection,
    selectionSlice,
    selectSelectedMapNodes,
    setSelection
} from './model/selectionSlice.js';
import {
    layersSlice,
    selectIsLayerVisible,
    selectVisibleLayers,
    setLayerVisible,
    setVisibleLayers
} from './model/layersSlice.js';
import {selectWorkspacePath, setWorkspacePath, workspaceSlice} from './model/workspaceSlice.js';
import {pointerModeSlice, selectPointerMode, setPointerMode} from './model/pointerModeSlice.js';
import pointerModes from './model/pointerModes.js';

export {
    useMap,
    useEditor,
    useEditorContext,
    useRenderContext,
    useWorkspace,
    usePointerMode,
    useNodeXml,
    useObserver,
    useListObserver,
    useMapObserver,
    useEditorObserver,
    EditorProvider,

    workspaceSlice,
    selectWorkspacePath,
    setWorkspacePath,

    selectionSlice,
    setSelection,
    clearSelection,
    selectSelectedMapNodes,
    addToSelection,
    removeFromSelection,

    layersSlice,
    selectVisibleLayers,
    selectIsLayerVisible,
    setVisibleLayers,
    setLayerVisible,

    pointerModeSlice,
    selectPointerMode,
    setPointerMode,
    pointerModes,
};
