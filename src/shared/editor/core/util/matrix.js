import {lusolve} from 'mathjs';

function getTransform(fromPoints, toPoints) {
    const A = buildMatrixA(fromPoints, toPoints);
    const b = buildVectorB(toPoints);

    const h = lusolve(A, b);

    return buildTransformMatrix(h);
}

function buildMatrixA(fromPoints, toPoints) {
    const matrix = [];

    for (let i = 0; i < 4; i++) {
        const [x1, y1] = [fromPoints[i].x, fromPoints[i].y];
        const [x2, y2] = [toPoints[i].x, toPoints[i].y];

        matrix.push([x1, y1, 1, 0, 0, 0, -x1 * x2, -y1 * x2]);
        matrix.push([0, 0, 0, x1, y1, 1, -x1 * y2, -y1 * y2]);
    }

    return matrix;
}

function buildVectorB(toPoints) {
    return toPoints.flatMap(p => [p.x, p.y]);
}

/** @param {number[]} h */
function buildTransformMatrix(h) {
    let v = h.flatMap(v => v);

    return [
        [v[0], v[1], 0, v[2]],
        [v[3], v[4], 0, v[5]],
        [0, 0, 1, 0],
        [v[6], v[7], 0, 1]
    ];
}

function relativize(vertices, origin) {
    return vertices.map(p => subtract(p, origin));
}

function subtract(a, b) {
    return {
        x: a[0] - b[0],
        y: a[1] - b[1],
    };
}

export function transpose(matrix) {
    return matrix.map((col, i) => matrix.map(row => row[i]));
}

export function getTransformMatrix(fromVertices, toVertices) {
    console.assert(
        fromVertices.length === 4 && toVertices.length === 4,
        'Both input arrays must have exactly 4 points'
    );

    let from = relativize(fromVertices, fromVertices[0]);
    let to = relativize(toVertices, fromVertices[0]);

    return getTransform(from, to);
}
