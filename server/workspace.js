import {glob} from 'glob';
import Paths from 'path';
import xpath from 'xpath';
import fs from 'fs/promises';
import {DOMParser} from 'xmldom';
import syncSizeOf from 'image-size';
import { promisify } from 'util';

const sizeOf = promisify(syncSizeOf);

export default class Workspace {

    #rootPath;

    #localeXml;

    constructor(workspaceName) {
        this.#rootPath = Paths.resolve('../workspaces/' + workspaceName);
    }

    get rootPath() {
        return this.#rootPath;
    }

    get exists() {
        return this.fileExists(this.#rootPath);
    }

    async getTextureSizes() {
        let sizes = {};
        let imageFiles = await this.#getAllFilesInDirectory('data/texture');

        let parallelTasks = imageFiles.map(async imageFile => {
            let lowerCaseFile = this.fixSlashes(this.toRelative(imageFile)).toLowerCase();

            sizes[lowerCaseFile] = await sizeOf(imageFile);
        });

        await Promise.all(parallelTasks);

        return sizes;
    }

    async getLevels() {
        let campaignLevels = await this.getCampaignLevels();
        let nonCampaignLevels = await this.getNonCampaignLevels(campaignLevels);

        return [...campaignLevels, ...nonCampaignLevels];
    }

    async getNonCampaignLevels(campaignLevels) {
        let campaignLevelFilenames = campaignLevels.map(level => level.path);
        let allLevelFiles = await this.#getAllFilesInDirectory('data/level/original');
        let nonCampaignFiles = allLevelFiles
            .map(filename => this.fixSlashes(this.toRelative(filename)))
            .filter(filename => !campaignLevelFilenames.includes(filename));

        return nonCampaignFiles.map(filename => Workspace.#getUnusedLevelInfo(filename));
    }

    async getCampaignLevels() {
        let campaignXml = await this.loadXml('data/cfg/campaign.xml');
        let levels = xpath.select('campaign/level', campaignXml);
        let realLevels = levels.filter(level => !xpath.select('boolean(fake)', level));
        let levelInfos = [];

        for (const level of realLevels) {
            levelInfos.push(await this.#getLevelInfo(level));
        }

        return levelInfos;
    }

    async loadXml(path) {
        let parser = new DOMParser();
        let campaignXmlString = await this.getFileContents(path);

        return parser.parseFromString(campaignXmlString);
    }

    async getFileContents(path) {
        return await fs.readFile(this.#normalize(path), 'utf8');
    }

    async setFileContents(path, contents) {
        await this.#ensureDir(Paths.dirname(path));

        return await fs.writeFile(this.#normalize(path), contents, 'utf8');
    }

    async #getLevelInfo(level) {
        let hint = xpath.select('string(hint)', level);

        return {
            id: xpath.select('number(@id)', level),
            title: await this.localize(hint),
            path: xpath.select('string(path)', level),
        };
    }

    static #getUnusedLevelInfo(levelFile) {
        return {
            id: null,
            title: 'Unused: ' + Paths.basename(levelFile),
            path: levelFile,
        };
    }

    async localize(hint) {
        let localeXml = await this.#getLocaleXml();
        let path = Workspace.#hintToPath(hint);
        let expression = `string(${path}/text())`;
        let node = xpath.select1(expression, localeXml);

        return Workspace.#cleanHashtags(node);
    }

    static #hintToPath(hint) {
        return hint.replace(/\$/, '/').replace(/\./g, '/');
    }

    static #cleanHashtags(node) {
        return node.replace(/#{!0x\w{8}}/g, '');
    }

    async #getLocaleXml() {
        if (!this.#localeXml) {
            this.#localeXml = await this.loadXml('data/language/Russian-1251.xml');
        }

        return this.#localeXml;
    }

    async fileExists(path) {
        try {
            await fs.access(this.#normalize(path));
            return true;
        } catch (e) {
            return false;
        }
    }

    async #getAllFilesInDirectory(path) {
        let pattern = Paths.join(path, '**/*');

        return await glob(this.#normalize(pattern), {
            nodir: true,
        });
    }

    async #ensureDir(path) {
        let normalizedPath = this.#normalize(path);

        if (await this.fileExists(normalizedPath)) {
            return true;
        }

        await fs.mkdir(normalizedPath, {
            recursive: true,
        });

        return await this.fileExists(normalizedPath);
    }

    #normalize(path) {
        if (!Paths.isAbsolute(path)) {
            path = this.toAbsolute(path);
        }

        return this.fixSlashes(path);
    }

    fixSlashes(path) {
        return path.replace(/\\/g, '/');
    }

    toAbsolute(relativePath) {
        return Paths.resolve(Paths.join(this.#rootPath, relativePath));
    }

    toRelative(absolutePath) {
        return Paths.relative(this.#rootPath, absolutePath);
    }
}
