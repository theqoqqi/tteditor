import styles from './MeshIcon.module.css';
import React from 'react';
import PropTypes from 'prop-types';
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

const ICONS_BY_TAGS = {
    terrain: BsSquareFill,
    landmark: BsLayersFill,
    structure: BsTreeFill,
    building: BsHouseFill,
    unit: BsPersonFill,
    item: BsSearch,
    chest: BsLockFill,
    magic: BsStars,
    ambient: BsVolumeUp,
    waypoint: BsRecord2,
    area: BsCircle,
};

MeshIcon.propTypes = {
    tag: PropTypes.string,
};

function MeshIcon({ tag }) {
    let Icon = ICONS_BY_TAGS[tag];

    return Icon && <Icon className={styles.meshIcon} />;
}

export default MeshIcon;