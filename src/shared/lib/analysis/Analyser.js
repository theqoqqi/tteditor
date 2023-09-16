import AnalysisData from './AnalysisData.js';

export default class Analyser {

    #data = new AnalysisData();

    /**
     * @param {Element} element
     * */
    analyse(element) {
        this.#traverse(element);
    }

    getResults() {
        return this.#data;
    }

    /**
     * @param {Element} element
     * */
    #traverse(element) {
        this.#data.putTag(element.tagName);
        this.#traverseAttributes(element);
        this.#traverseChildren(element);
    }

    /**
     * @param {Element} element
     * */
    #traverseAttributes(element) {
        for (const attribute of Array.from(element.attributes)) {
            this.#data.putAttribute(element.tagName, attribute.name, attribute.value);
        }
    }

    /**
     * @param {Element} element
     * */
    #traverseChildren(element) {
        let childElements = Array.from(element.childNodes);

        for (const childNode of childElements) {
            if (childNode.nodeType === childNode.ELEMENT_NODE) {
                // noinspection JSCheckFunctionSignatures
                this.#traverse(childNode);

                this.#data.putChild(element.tagName, childNode.tagName);

            } else if (childNode.nodeType === childNode.TEXT_NODE) {
                if (childNode.nodeValue.trim().length) {
                    this.#data.putContent(element.tagName, childNode.nodeValue)
                }
            }
        }
    }
}