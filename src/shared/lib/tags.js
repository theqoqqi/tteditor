import {
    BsBoxes,
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
        title: 'Ландшафт',
        icon: BsSquareFill,
    },
    landmark: {
        title: 'Декорации',
        icon: BsLayersFill,
        properties: ['tag', 'type', 'group', 'x', 'y'],
    },
    structure: {
        title: 'Объекты',
        icon: BsTreeFill,
        properties: ['tag', 'type', 'group', 'x', 'y', 'hint'],
    },
    building: {
        title: 'Здания',
        icon: BsHouseFill,
        properties: ['tag', 'type', 'group', 'x', 'y', 'owner', 'hint'],
    },
    unit: {
        title: 'Юниты',
        icon: BsPersonFill,
        properties: ['tag', 'type', 'group', 'x', 'y', 'owner'],
    },
    item: {
        title: 'Предметы',
        icon: BsSearch,
        properties: ['tag', 'type', 'subId', 'x', 'y'],
    },
    chest: {
        title: 'Сундуки',
        icon: BsLockFill,
        properties: ['tag', 'type', 'x', 'y'],
    },
    magic: {
        title: 'Эффекты',
        icon: BsStars,
        properties: ['tag', 'type', 'x', 'y', 'owner'],
    },
    ambient: {
        title: 'Звуки',
        icon: BsVolumeUp,
        properties: ['tag', 'type', 'x', 'y', 'owner'],
    },
    waypoint: {
        title: 'Точки пути',
        icon: BsRecord2,
        properties: ['tag', 'x', 'y'],
    },
    area: {
        title: 'Зоны',
        icon: BsCircle,
        properties: ['tag', 'group', 'name', 'x', 'y', 'radius', 'owner'],
    },
    composition: {
        title: 'Группы',
        icon: BsBoxes,
    },
};

export function getPluralTagTitle(tag) {
    return tags[tag]?.title ?? null;
}

export function getTagIconComponent(tag) {
    return tags[tag]?.icon ?? null;
}

export function getAllowedProperties(tag) {
    return tags[tag]?.properties ?? null;
}
