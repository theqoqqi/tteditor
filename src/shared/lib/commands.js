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
import {
    BsArrowsMove,
    BsBorderOuter,
    BsCircle,
    BsFileEarmarkCheckFill,
    BsFileEarmarkMedicalFill,
    BsFileEarmarkMinusFill,
    BsFileEarmarkPlusFill,
    BsGearFill,
    BsNodeMinusFill,
    BsNodePlusFill,
    BsPatchCheckFill,
    BsPatchMinusFill,
    BsPatchPlusFill,
    BsSquareFill,
    BsTools
} from 'react-icons/bs';

let icons = new Map([
    [AddNodesCommand, BsNodePlusFill],
    [InitialCommand, BsCircle],
    [AddRandomizersCommand, BsPatchPlusFill],
    [AddTriggersCommand, BsFileEarmarkPlusFill],
    [MoveNodesCommand, BsArrowsMove],
    [RemoveNodesCommand, BsNodeMinusFill],
    [RemoveRandomizersCommand, BsPatchMinusFill],
    [RemoveTriggersCommand, BsFileEarmarkMinusFill],
    [SetMapNodesPropertyCommand, BsGearFill],
    [SetMapPropertiesCommand, BsBorderOuter],
    [SetMapOptionsPropertiesCommand, BsTools],
    [SetRandomizerPropertyCommand, BsPatchCheckFill],
    [SetTerrainCommand, BsSquareFill],
    [SetTriggerEnabledCommand, BsFileEarmarkCheckFill],
    [SetTriggerPropertyCommand, BsFileEarmarkMedicalFill],
]);

export function getCommandIconComponent(command) {
    return icons.get(command.constructor);
}
