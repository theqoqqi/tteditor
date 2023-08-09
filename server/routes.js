import {responseEmpty, responseJson, responseXml, withWorkspace} from './utils.js';

export default function initRoutes(app) {
    app.get('/ping', function (request, response) {
        responseJson(response, 200, 'pong');
    });

    app.get('/files', withWorkspace(async function (request, response, workspace) {
        let path = request.query.path;

        return await responseXml(response, workspace, path);
    }));

    app.post('/files', withWorkspace(async function (request, response, workspace) {
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