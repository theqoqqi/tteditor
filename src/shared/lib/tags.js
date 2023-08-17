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
        title: 'Ландшафт',
        icon: BsSquareFill,
    },
    landmark: {
        title: 'Декорации',
        icon: BsLayersFill,
    },
    structure: {
        title: 'Объекты',
        icon: BsTreeFill,
    },
    building: {
        title: 'Здания',
        icon: BsHouseFill,
    },
    unit: {
        title: 'Юниты',
        icon: BsPersonFill,
    },
    item: {
        title: 'Предметы',
        icon: BsSearch,
    },
    chest: {
        title: 'Сундуки',
        icon: BsLockFill,
    },
    magic: {
        title: 'Эффекты',
        icon: BsStars,
    },
    ambient: {
        title: 'Звуки',
        icon: BsVolumeUp,
    },
    waypoint: {
        title: 'Точки пути',
        icon: BsRecord2,
    },
    area: {
        title: 'Зоны',
        icon: BsCircle,
    },
};

export function getPluralTagTitle(tag) {
    return tags[tag]?.title ?? null;
}

export function getTagIconComponent(tag) {
    return tags[tag]?.icon ?? null;
}
