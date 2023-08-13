import {xmlUtils} from '../../../shared/editor';

export function isValidMesh(meshXml) {
    let meshWidth = xmlUtils.getNumericContent(meshXml, 'width');
    let meshHeight = xmlUtils.getNumericContent(meshXml, 'height');

    return meshWidth && meshHeight;
}

export function getMeshXml(nodeXml) {
    return nodeXml.querySelector(':scope > mesh');
}

export function getTextureXml(nodeXml) {
    return nodeXml.querySelector(':scope > texture');
}