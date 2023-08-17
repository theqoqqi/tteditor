import styles from './MeshIcon.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {getTagIconComponent} from '../../../../../shared/lib';

MeshIcon.propTypes = {
    tag: PropTypes.string,
};

function MeshIcon({ tag }) {
    let Icon = getTagIconComponent(tag);

    return Icon && <Icon className={styles.meshIcon} />;
}

export default MeshIcon;