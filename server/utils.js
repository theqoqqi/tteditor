import Workspace from './workspace.js';

export function withWorkspace(handler) {
    return async (request, response) => {
        let workspacePath = request.query.workspace ?? request.body.workspace;

        if (!workspacePath) {
            return responseJson(response, 400, {
                reason: 'WORKSPACE_PARAMETER_REQUIRED',
            });
        }

        let workspace = new Workspace(workspacePath);

        if (!await workspace.exists) {
            return responseJson(response, 404, {
                reason: 'WORKSPACE_NOT_EXISTS',
            });
        }

        return handler(request, response, workspace);
    };
}

export async function responseXml(response, workspace, path) {
    if (!await workspace.fileExists(path)) {
        return responseJson(response, 404, {
            reason: 'FILE_NOT_FOUND',
        });
    }

    try {
        let fileContents = await workspace.getFileContents(path, 'utf8');

        return responseXmlText(response, 200, fileContents);
    } catch (e) {
        return responseJson(response, 500, {
            reason: 'UNABLE_TO_READ_FILE',
            error: e.message,
        });
    }
}

export function responseJson(response, status, json = {}) {
    responseJsonText(response, status, JSON.stringify(json, null, 4));
}

export function responseJsonText(response, status, json) {
    response.writeHead(status, {
        'Content-Type': 'application/json',
    });
    response.write(json);
    response.end();
}

export function responseXmlText(response, status, json) {
    response.writeHead(status, {
        'Content-Type': 'text/xml',
    });
    response.write(json);
    response.end();
}

export function responseEmpty(response, status) {
    response.writeHead(status);
    response.end();
}
