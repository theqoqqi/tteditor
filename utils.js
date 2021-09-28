
Element.prototype.getTextContentOf = function (selector, defaultValue = null) {
    // let element = this.querySelector(selector);
    let element = this.querySelector(`:scope > ${selector}`);
    return element?.textContent ?? defaultValue;
}

Element.prototype.getNumericContentOf = function (selector, defaultValue = null) {
    let text = this.getTextContentOf(selector);
    return text && text !== '' ? +text : defaultValue;
}

// ''+ специально, чтобы IDE не подсказывала эти варианты
XMLDocument.prototype[''+'getTextContentOf'] = Element.prototype.getTextContentOf;
XMLDocument.prototype[''+'getNumericContentOf'] = Element.prototype.getNumericContentOf;

$.fn.isInViewport = function() {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function hexIntColorToColor(color) {
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

function colorToHexIntColor(c) {
    if (!c) {
        return null;
    }

    let components = componentToHex(c.a) +componentToHex(c.r) + componentToHex(c.g) +  componentToHex(c.b);

    return '0x' + components.toUpperCase();
}

function getColorBrightness(c) {
    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

function colorToCssRgba(c) {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`;
}

function hexColorToColor(c) {
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

function colorToHexColor(c) {
    if (!c) {
        return null;
    }
    return '#' + componentToHex(c.r) + componentToHex(c.g) + componentToHex(c.b) + componentToHex(c.a);
}

function componentToHex(c) {
    const hex = (+c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function verticesToBounds(vertices) {
    let positions = verticesToPositions(vertices);

    return createBounds(
        Math.min(positions[0].x, positions[1].x),
        Math.min(positions[0].y, positions[2].y),
        Math.max(positions[2].x, positions[3].x),
        Math.max(positions[1].y, positions[3].y)
    );
}

function createBoundsWithSize(x, y, w, h) {
    return createBounds(x, y, x + w, y + h);
}

function createBounds(minX, minY, maxX, maxY) {
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

function fillBoundsFields(bounds) {
    bounds.x = bounds.minX;
    bounds.y = bounds.minY;
    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;
}

function swapFields(object, a, b) {
    let temp = object[a];
    object[a] = object[b];
    object[b] = temp;
}

function verticesToPositions(vertices) {
    return [
        this.verticeToPosition(vertices[0]),
        this.verticeToPosition(vertices[1]),
        this.verticeToPosition(vertices[2]),
        this.verticeToPosition(vertices[3]),
    ];
}

function verticeToPosition(vertice) {
    return {
        x: vertice[0],
        y: vertice[1],
    };
}

function createBoxVertices(x, y, w, h) {
    return [
        [x,     y    ],
        [x,     y + h],
        [x + w, y    ],
        [x + w, y + h],
    ];
}

function flipVertices(vertices, flipX, flipY) {
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

// noinspection JSUnusedGlobalSymbols
function sumVertices(v1, v2) {
    return [
        [v1[0][0] + v2[0][0], v1[0][1] + v2[0][1]],
        [v1[1][0] + v2[1][0], v1[1][1] + v2[1][1]],
        [v1[2][0] + v2[2][0], v1[2][1] + v2[2][1]],
        [v1[3][0] + v2[3][0], v1[3][1] + v2[3][1]],
    ];
}

function reformatXml(xml) {
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

function downloadXml(filename, xml) {

    let element = document.createElement('a');

    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(xml));
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}