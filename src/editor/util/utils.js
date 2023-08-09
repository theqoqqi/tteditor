
export function verticesToBounds(vertices) {
    let positions = verticesToPositions(vertices);

    return createBounds(
        Math.min(positions[0].x, positions[1].x, positions[2].x, positions[3].x),
        Math.min(positions[0].y, positions[1].y, positions[2].y, positions[3].y),
        Math.max(positions[0].x, positions[1].x, positions[2].x, positions[3].x),
        Math.max(positions[0].y, positions[1].y, positions[2].y, positions[3].y)
    );
}

export function createBoundsWithSize(x, y, w, h) {
    return createBounds(x, y, x + w, y + h);
}

export function createBounds(minX, minY, maxX, maxY) {
    let bounds = { minX, minY, maxX, maxY };

    if (bounds.minX > bounds.maxX) {
        swapFields(bounds, 'minX', 'maxX');
    }

    if (bounds.minY > bounds.maxY) {
        swapFields(bounds, 'minY', 'maxY');
    }

    fillBoundsFields(bounds);

    return bounds;
}

export function fillBoundsFields(bounds) {
    bounds.x = bounds.minX;
    bounds.y = bounds.minY;
    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;
}

export function shiftBounds(bounds, x, y) {
    bounds.x += x;
    bounds.y += y;
    bounds.minX += x;
    bounds.minY += y;
    bounds.maxX += x;
    bounds.maxY += y;
}

export function combineBounds(listOfBounds) {
    let aggregateFunc = (array, funcName, propertyName) => {
        let mapped = array.map(item => item[propertyName]);

        return Math[funcName](...mapped);
    };

    let minX = aggregateFunc(listOfBounds, 'min', 'minX');
    let minY = aggregateFunc(listOfBounds, 'min', 'minY');
    let maxX = aggregateFunc(listOfBounds, 'max', 'maxX');
    let maxY = aggregateFunc(listOfBounds, 'max', 'maxY');

    return createBounds(minX, minY, maxX, maxY);
}

export function swapFields(object, a, b) {
    let temp = object[a];
    object[a] = object[b];
    object[b] = temp;
}

export function verticesToPositions(vertices) {
    return [
        this.verticeToPosition(vertices[0]),
        this.verticeToPosition(vertices[1]),
        this.verticeToPosition(vertices[2]),
        this.verticeToPosition(vertices[3]),
    ];
}

export function verticeToPosition(vertice) {
    return {
        x: vertice[0],
        y: vertice[1],
    };
}

export function createBoxVertices(x, y, w, h) {
    return [
        [x,     y    ],
        [x,     y + h],
        [x + w, y    ],
        [x + w, y + h],
    ];
}

export function flipVertices(vertices, flipX, flipY) {
    if (flipX) {
        vertices[0][0] = -vertices[0][0];
        vertices[1][0] = -vertices[1][0];
        vertices[2][0] = -vertices[2][0];
        vertices[3][0] = -vertices[3][0];
    }
    if (flipY) {
        vertices[0][1] = -vertices[0][1];
        vertices[1][1] = -vertices[1][1];
        vertices[2][1] = -vertices[2][1];
        vertices[3][1] = -vertices[3][1];
    }
}

export function swapVertices(vertices, swapX, swapY) {
    if (swapX) {
        swapIndexes(vertices, 0, 2);
        swapIndexes(vertices, 1, 3);
    }
    if (swapY) {
        swapIndexes(vertices, 0, 1);
        swapIndexes(vertices, 2, 3);
    }

    return vertices;
}

export function swapIndexes(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

// noinspection JSUnusedGlobalSymbols
export function sumVertices(v1, v2) {
    return [
        [v1[0][0] + v2[0][0], v1[0][1] + v2[0][1]],
        [v1[1][0] + v2[1][0], v1[1][1] + v2[1][1]],
        [v1[2][0] + v2[2][0], v1[2][1] + v2[2][1]],
        [v1[3][0] + v2[3][0], v1[3][1] + v2[3][1]],
    ];
}

