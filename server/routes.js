import {responseEmpty, responseFile, responseJson, responseXml, withWorkspace} from './utils.js';
import Workspace from './workspace.js';
import installAndRun from './installAndRun.js';

export default function initRoutes(app) {
    app.get('/ping', function (request, response) {
        responseJson(response, 200, 'pong');
    });

    app.post('/workspaces', async function (request, response) {
        let path = request.body.path;

        if (!path) {
            return responseJson(response, 400, {
                reason: 'WORKSPACE_BODY_PARAMETER_REQUIRED',
            });
        }

        let workspace = new Workspace(path);

        if (await workspace.exists) {
            return responseJson(response, 200, {
                status: 'OK',
            });
        }

        try {
            await workspace.create();

            return responseJson(response, 201, {
                status: 'OK',
            });
        } catch (e) {
            return responseJson(response, 500, {
                reason: 'UNABLE_TO_CREATE_WORKSPACE',
                error: e.message,
            });
        }
    });

    app.post('/run', withWorkspace(async function (request, response, workspace) {
        try {
            await installAndRun({
                workspacePath: workspace.rootPath,
                gamePath: process.env.GAME_PATH,
                gameDataPath: process.env.GAME_DATA_PATH,
            });

            return responseEmpty(response, 200);
        } catch (e) {
            return responseJson(response, 500, {
                reason: 'UNABLE_TO_RUN_GAME',
                error: e.message,
            });
        }
    }));

    app.get('/files', withWorkspace(async function (request, response, workspace) {
        let path = request.query.path;

        await responseFile(response, workspace, path);
    }));

    app.get('/xmls', withWorkspace(async function (request, response, workspace) {
        let path = request.query.path;

        return await responseXml(response, workspace, path);
    }));

    app.post('/xmls', withWorkspace(async function (request, response, workspace) {
        try {
            let path = request.body.path;
            let contents = request.body.contents;

            await workspace.setFileContents(path, contents);

            return responseEmpty(response, 200);
        } catch (e) {
            return responseJson(response, 500, {
                reason: 'UNABLE_TO_WRITE_FILE',
                error: e.message,
            });
        }
    }));

    app.get('/levels', withWorkspace(async function (request, response, workspace) {
        try {
            let levels = await workspace.getLevels();

            return responseJson(response, 200, levels);
        } catch (e) {
            return responseJson(response, 500, {
                reason: 'UNABLE_TO_LOAD_LEVELS',
                error: e.message,
            });
        }
    }));

    app.get('/images', withWorkspace(async function (request, response, workspace) {
        try {
            let textureSizes = await workspace.getTextureSizes();

            return responseJson(response, 200, textureSizes);
        } catch (e) {
            return responseJson(response, 500, {
                reason: 'UNABLE_TO_LOAD_TEXTURES',
                error: e.message,
            });
        }
    }));
}