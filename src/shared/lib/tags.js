import {
    BsCircle,
    BsHouseFill,
    BsLayersFill,
    BsLockFill,
    BsPersonFill,
    BsRecord2,
    BsSearch,
    BsSquareFill,
    BsStars,
    BsTreeFill,
    BsVolumeUp
} from 'react-icons/bs';

let tags = {
    terrain: {
        icon: BsSquareFill,
    },
    landmark: {
        icon: BsLayersFill,
    },
    structure: {
        icon: BsTreeFill,
    },
    building: {
        icon: BsHouseFill,
    },
    unit: {
        icon: BsPersonFill,
    },
    item: {
        icon: BsSearch,
    },
    chest: {
        icon: BsLockFill,
    },
    magic: {
        icon: BsStars,
    },
    ambient: {
        icon: BsVolumeUp,
    },
    waypoint: {
        icon: BsRecord2,
    },
    area: {
        icon: BsCircle,
    },
};

export function getTagIconComponent(tag) {
    return tags[tag]?.icon ?? null;
}
