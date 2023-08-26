import styles from './MeshIcon.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {getTagIconComponent} from '../../../../../shared/lib';
import classNames from 'classnames';

MeshIcon.propTypes = {
    className: PropTypes.any,
    tag: PropTypes.string,
};

function MeshIcon({ className, tag }) {
    let Icon = getTagIconComponent(tag);

    return Icon && <Icon className={classNames(styles.meshIcon, className)} />;
}

export default MeshIcon;