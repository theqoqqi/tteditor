import styles from './StatusBar.module.css';
import React from 'react';

function StatusBar() {
    return (
        <div className={styles.statusBar}>
            Строка состояния
        </div>
    );
}

export default StatusBar;
