import {useState} from 'react';
import {useEditorContext} from '../../../../entities/editor';
import {geometryUtils, xmlUtils} from '../../../../shared/lib';
import {useTimeoutFn} from 'react-use';

let ICON_SIZE = 64;

export default function useRescaleNodesToFitPreview(ref, nodeMetadata) {
    let editorContext = useEditorContext();
    let [isVisible, setIsVisible] = useState(false);
    let [scalingStyles, setScalingStyles] = useState(null);
    let timeoutDelay = 300 + 200 * Math.random();

    useTimeoutFn(async () => {
        if (scalingStyles !== null) {
            return;
        }

        let bounds = getContentBounds(ref.current);

        if (!isValidBounds(bounds)) {
            return;
        }

        let { x, y, scale } = await resolvePlacement(bounds);

        applyStyles(createStyles(x, y, scale));
    }, timeoutDelay);

    async function resolvePlacement(bounds) {
        let tag = nodeMetadata.tagName;
        let nodeXml = await editorContext.getNodeXml(nodeMetadata);

        let x = ICON_SIZE / 2;
        let y = ICON_SIZE / 2;
        let ratioX = ICON_SIZE / bounds.width;
        let ratioY = ICON_SIZE / bounds.height;

        if (editorContext.isSimpleNode(tag)) {
            let texture = nodeXml?.querySelector('texture')?.textContent;

            let imageSize = editorContext.getImageSize(texture);
            let imageWidth = imageSize?.width;
            let imageHeight = imageSize?.height;

            let meshXml = nodeXml.querySelector(':scope mesh');
            let meshWidth = xmlUtils.getNumericContent(meshXml, 'width');
            let meshHeight = xmlUtils.getNumericContent(meshXml, 'height');
            let meshAnchorX = xmlUtils.getNumericContent(meshXml, 'anchorx', meshWidth / 2);
            let meshAnchorY = xmlUtils.getNumericContent(meshXml, 'anchory', meshHeight / 2);

            if (imageWidth && imageHeight && meshWidth && meshHeight) {
                ratioX *= imageWidth / meshWidth;
                ratioY *= imageHeight / meshHeight;
            }

            if (texture) {
                x = ICON_SIZE * (meshAnchorX / meshWidth);
                y = ICON_SIZE * (meshAnchorY / meshHeight);
            }
        }

        let scale = Math.min(1, ratioX, ratioY);

        return { x, y, scale };
    }

    function isValidBounds(bounds) {
        return bounds && isFinite(bounds.width) && isFinite(bounds.height);
    }

    function createStyles(x, y, scale) {
        return {
            position: 'absolute',
            left: x,
            top: y,
            width: 0,
            height: 0,
            opacity: 1,
            transform: `scale(${scale})`,
            transition: 'all .3s',
        };
    }

    function applyStyles(newStyles) {
        setIsVisible(true);

        setTimeout(() => {
            setScalingStyles(oldStyles => oldStyles ?? newStyles);
        }, 20);
    }

    function getContentBounds(element) {
        let rect = element.getBoundingClientRect();
        let bounds = getChildrenBounds(element.children);

        return bounds ? geometryUtils.shiftBounds(bounds, rect.x, rect.y) : null;
    }

    function getBounds(element) {
        let rect = element.getBoundingClientRect();

        return geometryUtils.createBoundsWithSize(rect.x, rect.y, rect.width, rect.height);
    }

    function getChildrenBounds(elements) {
        let allBounds = getAllBounds(elements);

        return allBounds.length ? geometryUtils.combineBounds(...allBounds) : null;
    }

    function getAllBounds(elements) {
        let allBounds = [];

        for (const element of elements) {
            let bounds = getBounds(element);
            let allChildBounds = getAllBounds(element.children);

            allBounds.push(bounds, ...allChildBounds);
        }

        return allBounds.filter(bounds => {
            return bounds.width > 0 && bounds.height > 0;
        });
    }

    return { isVisible, scalingStyles };
}