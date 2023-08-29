import {getPluralTagTitle, getTagIconComponent} from './tags.js';
import useSelectorWithParams from './hooks/useSelectorWithParams.js';
import Editor from './editor/Editor.js';
import EditorContext from './editor/EditorContext.js';
import RenderContext from './editor/RenderContext.js';
import LevelEditor from './editor/LevelEditor.js';
import MapReader from './editor/MapReader.js';
import MapWriter from './editor/MapWriter.js';
import GameMap from './editor/map/GameMap.js';
import MapNode from './editor/map/MapNode.js';
import MapOptions from './editor/map/MapOptions.js';
import MapTerrain from './editor/map/MapTerrain.js';
import RandomizerOption from './editor/map/RandomizerOption.js';
import Trigger from './editor/map/Trigger.js';
import AddNodesCommand from './editor/commands/map/AddNodesCommand.js';
import AddRandomizersCommand from './editor/commands/map/AddRandomizersCommand.js';
import AddTriggersCommand from './editor/commands/map/AddTriggersCommand.js';
import MoveNodesCommand from './editor/commands/map/MoveNodesCommand.js';
import RemoveNodesCommand from './editor/commands/map/RemoveNodesCommand.js';
import RemoveRandomizersCommand from './editor/commands/map/RemoveRandomizersCommand.js';
import RemoveTriggersCommand from './editor/commands/map/RemoveTriggersCommand.js';
import SetMapNodesPropertyCommand from './editor/commands/map/SetMapNodesPropertyCommand.js';
import SetMapPropertiesCommand from './editor/commands/map/SetMapPropertiesCommand.js';
import SetRandomizerPropertyCommand from './editor/commands/map/SetRandomizerPropertyCommand.js';
import SetTerrainCommand from './editor/commands/map/SetTerrainCommand.js';
import SetTriggerEnabledCommand from './editor/commands/map/SetTriggerEnabledCommand.js';
import SetTriggerPropertyCommand from './editor/commands/map/SetTriggerPropertyCommand.js';
import CompositeObserver from './editor/util/observables/CompositeObserver.js';
import Observable from './editor/util/observables/Observable.js';
import ObservableArray from './editor/util/observables/ObservableArray.js';
import * as colorsUtils from './editor/util/colors.js';
import * as geometryUtils from './editor/util/geometry.js';
import * as matrixUtils from './editor/util/matrix.js';
import * as xmlUtils from './editor/util/xml.js';

export {
    getPluralTagTitle,
    getTagIconComponent,
    useSelectorWithParams,

    Editor,
    LevelEditor,
    EditorContext,
    RenderContext,
    MapReader,
    MapWriter,

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

    CompositeObserver,
    Observable,
    ObservableArray,

    colorsUtils,
    geometryUtils,
    matrixUtils,
    xmlUtils,
};
