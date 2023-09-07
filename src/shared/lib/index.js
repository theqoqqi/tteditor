import {getPluralTagTitle, getTagIconComponent, getAllowedProperties} from './tags';
import {getCommandIconComponent} from './commands';
import useSelectorWithParams from './hooks/useSelectorWithParams';
import useFirstIntersection from './hooks/useFirstIntersection';
import Editor from './editor/Editor';
import EditorContext from './editor/EditorContext';
import RenderContext from './editor/RenderContext';
import LevelEditor from './editor/LevelEditor';
import MapReader from './editor/MapReader';
import MapWriter from './editor/MapWriter';
import GameMap from './editor/map/GameMap';
import MapNode from './editor/map/MapNode';
import MapOptions from './editor/map/MapOptions';
import MapTerrain from './editor/map/MapTerrain';
import RandomizerOption from './editor/map/RandomizerOption';
import Trigger from './editor/map/Trigger';
import AbstractCommand from './editor/commands/AbstractCommand';
import InitialCommand from './editor/commands/InitialCommand';
import AddNodesCommand from './editor/commands/map/AddNodesCommand';
import AddRandomizersCommand from './editor/commands/map/AddRandomizersCommand';
import AddTriggersCommand from './editor/commands/map/AddTriggersCommand';
import MoveNodesCommand from './editor/commands/map/MoveNodesCommand';
import RemoveNodesCommand from './editor/commands/map/RemoveNodesCommand';
import RemoveRandomizersCommand from './editor/commands/map/RemoveRandomizersCommand';
import RemoveTriggersCommand from './editor/commands/map/RemoveTriggersCommand';
import SetMapNodesPropertyCommand from './editor/commands/map/SetMapNodesPropertyCommand';
import SetMapPropertiesCommand from './editor/commands/map/SetMapPropertiesCommand';
import SetMapOptionsPropertiesCommand from './editor/commands/map/SetMapOptionsPropertiesCommand';
import SetRandomizerPropertyCommand from './editor/commands/map/SetRandomizerPropertyCommand';
import SetTerrainCommand from './editor/commands/map/SetTerrainCommand';
import SetTriggerEnabledCommand from './editor/commands/map/SetTriggerEnabledCommand';
import SetTriggerPropertyCommand from './editor/commands/map/SetTriggerPropertyCommand';
import CompositeObserver from './editor/util/observables/CompositeObserver';
import Observable from './editor/util/observables/Observable';
import ObservableArray from './editor/util/observables/ObservableArray';
import * as colorsUtils from './editor/util/colors';
import * as geometryUtils from './editor/util/geometry';
import * as matrixUtils from './editor/util/matrix';
import * as xmlUtils from './editor/util/xml';
import useMap from './hooks/editor/useMap';
import useEditor from './hooks/editor/useEditor';
import useEditorContext from './hooks/editor/useEditorContext';
import useRenderContext from './hooks/editor/useRenderContext';
import useNodeXml from './hooks/editor/useNodeXml';
import useObserver from './hooks/editor/useObserver';
import useListObserver from './hooks/editor/useListObserver';
import useMapObserver from './hooks/editor/useMapObserver';
import useMapListObserver from './hooks/editor/useMapListObserver';
import useEditorObserver from './hooks/editor/useEditorObserver';
import editorInstance from './context/instance';
import EditorProvider from './context/provider';

export {
    getPluralTagTitle,
    getTagIconComponent,
    getAllowedProperties,
    getCommandIconComponent,
    useSelectorWithParams,
    useFirstIntersection,

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

    AbstractCommand,
    InitialCommand,
    AddNodesCommand,
    AddRandomizersCommand,
    AddTriggersCommand,
    MoveNodesCommand,
    RemoveNodesCommand,
    RemoveRandomizersCommand,
    RemoveTriggersCommand,
    SetMapNodesPropertyCommand,
    SetMapPropertiesCommand,
    SetMapOptionsPropertiesCommand,
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

    useMap,
    useEditor,
    useEditorContext,
    useRenderContext,
    useNodeXml,
    useObserver,
    useListObserver,
    useMapObserver,
    useMapListObserver,
    useEditorObserver,

    editorInstance,
    EditorProvider,
};
