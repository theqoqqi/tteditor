
export function getNumericContent(ofElement, selector, defaultValue = null) {
    let text = getTextContent(ofElement, selector, null);

    return text && text !== '' ? +text : defaultValue;
}

export function getTextContent(ofElement, selector, defaultValue = null) {
    let child = ofElement.querySelector(`:scope > ${selector}`);

    return child?.textContent ?? defaultValue;
}

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

export function reformatXml(xml) {
    let reg = /(>)\s*(<)(\/*)/g;
    let wsexp = / *(.*) +\n/g;
    let contexp = /(<.+>)(.+\n)/g;

    xml = xml
        .replace(reg, '$1\n$2$3')
        .replace(wsexp, '$1\n')
        .replace(contexp, '$1\n$2')
        // .replace(/<(\w+)\/>/g, '<$1 />')
        .replace(/&gt;/g, '>')
        .replace(/">/g, '" >')
        .replace(/"\/>/g, '" />');

    let formatted = '';
    let lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';

    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
    let transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,

        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,

        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,

        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0,
    };

    for (let i = 0; i < lines.length; i++) {
        let ln = lines[i];

        if (ln.match(/\s*<\?xml/)) {
            formatted += ln + '\n';
            continue;
        }
        // ---

        let single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
        let closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
        let opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
        let type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
        let fromTo = lastType + '->' + type;
        let padding = '';

        lastType = type;

        indent += transitions[fromTo];

        for (let j = 0; j < indent; j++) {
            padding += '\t';
        }

        if (fromTo === 'opening->closing') {
            formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
        } else {
            formatted += padding + ln + '\n';
        }
    }

    return formatted;
}

export function downloadXml(filename, xml) {

    let element = document.createElement('a');

    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(xml));
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}