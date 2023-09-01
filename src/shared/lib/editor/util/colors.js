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