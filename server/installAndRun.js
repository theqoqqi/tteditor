import reflect from '@alumna/reflect';
import * as path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { glob } from 'glob';

async function reflectFiles(workspacePath, gamePath) {
    let { err } = await reflect({
        src: path.resolve(workspacePath, 'data'),
        dest: path.resolve(gamePath, 'data'),

        recursive: true,
        delete: true,
    });

    if (err) {
        throw new Error(err);
    }
}

async function initTestPlayer(gameDataPath) {
    let originalProfilePath = path.resolve(gameDataPath, 'profiles.dat');
    let testProfilePath = path.resolve('testData/profiles.dat');
    let questFilesWildcard = path.resolve(gameDataPath, 'quest-*.dat');

    if (!await fileExists(testProfilePath)) {
        return;
    }

    fs.writeFileSync(originalProfilePath, fs.readFileSync(testProfilePath));

    let questFiles = await glob(questFilesWildcard.replaceAll('\\', '/'));

    for (const questFile of questFiles) {
        await fs.unlinkSync(questFile);
    }
}

async function fileExists(path) {
    try {
        await fs.accessSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

function runGame(gamePath) {
    exec('".\\Totem Tribe Gold.exe"', {
        cwd: gamePath,
    }, (...args) => console.log(...args));
}

export default async function installAndRun({ workspacePath, gamePath, gameDataPath }) {
    await reflectFiles(workspacePath, gamePath);
    await initTestPlayer(gameDataPath);

    runGame(gamePath);
}
