
export function hexIntColorToColor(color) {
    if (!color) {
        return null;
    }

    let regex = /0x(\w{2})(\w{2})(\w{2})(\w{2})/g;
    let parts = regex.exec(color);
    let a = parseInt(parts[1], 16);
    let r = parseInt(parts[2], 16);
    let g = parseInt(parts[3], 16);
    let b = parseInt(parts[4], 16);

    return { a, r, g, b };
}

export function colorToHexIntColor(c) {
    if (!c) {
        return null;
    }

    let components = componentToHex(c.a) + componentToHex(c.r) + componentToHex(c.g) + componentToHex(c.b);

    return '0x' + components.toUpperCase();
}

export function rgbaColorToHsbaColor(color) {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const v = Math.max(r, g, b);
    const n = v - Math.min(r, g, b);

    const h =
        n === 0
            ? 0
            : n && v === r
                ? (g - b) / n
                : v === g
                    ? 2 + (b - r) / n
                    : 4 + (r - g) / n;

    return {
        h: 60 * (h < 0 ? h + 6 : h),
        s: v && (n / v) * 100,
        b: v * 100,
        a: color.a,
    };
}

export function hsbaColorToCssFilters(color) {
    let h = color.h;
    let s = color.s;
    let b = color.b;
    let a = color.a / 255;

    return `opacity(${a}) saturate(${s}%) brightness(${b}%) hue-rotate(${h}deg)`;
}

export function getColorBrightness(c) {
    if (!c) {
        return null;
    }

    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

export function colorToCssRgba(c) {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`;
}

export function hexColorToColor(c) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);

    if (!result) {
        return null;
    }

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16),
    };
}

export function colorToHexColor(c) {
    if (!c) {
        return null;
    }
    return '#' + componentToHex(c.r) + componentToHex(c.g) + componentToHex(c.b) + componentToHex(c.a);
}

export function componentToHex(c) {
    const hex = (+c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

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

