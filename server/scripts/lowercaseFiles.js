import fs from 'fs/promises';
import Paths from 'path';
import {glob} from 'glob';

async function renameFilesInDirectory(dir) {
    const paths = await glob(dir + '/**/*', {
        nodir: true,
    });

    for (const file of paths) {
        const directory = Paths.dirname(file);
        const fileName = Paths.basename(file);
        const newName = Paths.join(directory, fileName.toLowerCase());

        if (file !== newName) {
            await fs.rename(file, newName);

            console.log(`${file} -> ${newName}`);
        }
    }
}

renameFilesInDirectory('../../data/texture')
    .then(() => console.log('File renaming completed'))
    .catch(error => console.error('Error:', error));