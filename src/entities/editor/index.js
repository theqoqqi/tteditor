import useMap from './lib/hooks/useMap.js';
import useEditor from './lib/hooks/useEditor.js';
import useEditorContext from './lib/hooks/useEditorContext.js';
import useRenderContext from './lib/hooks/useRenderContext.js';
import useNodeXml from './lib/hooks/useNodeXml.js';
import useObserver from './lib/hooks/useObserver.js';
import useListObserver from './lib/hooks/useListObserver.js';
import useMapObserver from './lib/hooks/useMapObserver.js';
import useEditorObserver from './lib/hooks/useEditorObserver.js';
import EditorProvider from './lib/provider.js';
import * as styling from './lib/rendering/styling.js';
import * as colorsUtils from './core/util/colors.js';
import * as geometryUtils from './core/util/geometry.js';
import * as matrixUtils from './core/util/matrix.js';
import * as xmlUtils from './core/util/xml.js';
import GameMap from './core/map/GameMap.js';
import MapNode from './core/map/MapNode.js';
import MapOptions from './core/map/MapOptions.js';
import MapTerrain from './core/map/MapTerrain.js';
import RandomizerOption from './core/map/RandomizerOption.js';
import Trigger from './core/map/Trigger.js';
import AddNodesCommand from './core/commands/map/AddNodesCommand.js';
import AddRandomizersCommand from './core/commands/map/AddRandomizersCommand.js';
import AddTriggersCommand from './core/commands/map/AddTriggersCommand.js';
import MoveNodesCommand from './core/commands/map/MoveNodesCommand.js';
import RemoveNodesCommand from './core/commands/map/RemoveNodesCommand.js';
import RemoveRandomizersCommand from './core/commands/map/RemoveRandomizersCommand.js';
import RemoveTriggersCommand from './core/commands/map/RemoveTriggersCommand.js';
import SetMapNodesPropertyCommand from './core/commands/map/SetMapNodesPropertyCommand.js';
import SetMapPropertiesCommand from './core/commands/map/SetMapPropertiesCommand.js';
import SetRandomizerPropertyCommand from './core/commands/map/SetRandomizerPropertyCommand.js';
import SetTerrainCommand from './core/commands/map/SetTerrainCommand.js';
import SetTriggerEnabledCommand from './core/commands/map/SetTriggerEnabledCommand.js';
import SetTriggerPropertyCommand from './core/commands/map/SetTriggerPropertyCommand.js';
import {
    selectionSlice,
    selectSelectedMapNodes,
    setSelection,
    clearSelection,
    addToSelection,
    removeFromSelection
} from './model/selectionSlice.js';
import {
    layersSlice,
    selectIsLayerVisible,
    setVisibleLayers,
    setLayerVisible,
} from './model/layersSlice.js';

export {
    useMap,
    useEditor,
    useEditorContext,
    useRenderContext,
    useNodeXml,
    useObserver,
    useListObserver,
    useMapObserver,
    useEditorObserver,
    EditorProvider,

    selectionSlice,
    setSelection,
    clearSelection,
    selectSelectedMapNodes,
    addToSelection,
    removeFromSelection,

    layersSlice,
    selectIsLayerVisible,
    setVisibleLayers,
    setLayerVisible,

    styling,
    colorsUtils,
    geometryUtils,
    matrixUtils,
    xmlUtils,

    GameMap,
    MapNode,
    MapOptions,
    MapTerrain,
    RandomizerOption,
    Trigger,

    AddNodesCommand,
    AddRandomizersCommand,
    AddTriggersCommand,
    MoveNodesCommand,
    RemoveNodesCommand,
    RemoveRandomizersCommand,
    RemoveTriggersCommand,
    SetMapNodesPropertyCommand,
    SetMapPropertiesCommand,
    SetRandomizerPropertyCommand,
    SetTerrainCommand,
    SetTriggerEnabledCommand,
    SetTriggerPropertyCommand,
};
