
class TagDescriptor {

    #name;

    #allowedAttributes = new Map();

    #allowedChildTags = new Set();

    #allowedContents = new Set();

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    /** @return AttributeDescriptor[] */
    get allowedAttributes() {
        return Array.from(this.#allowedAttributes.values());
    }

    /** @return TagDescriptor[] */
    get allowedChildren() {
        return Array.from(this.#allowedChildTags.values());
    }

    /** @return string[] */
    get allowedContents() {
        return Array.from(this.#allowedContents.values());
    }

    putAttribute(attributeName, value = null) {
        if (!this.#allowedAttributes.has(attributeName)) {
            let attribute = new AttributeDescriptor(attributeName);

            this.#allowedAttributes.set(attributeName, attribute);
        }

        if (value !== null) {
            this.#allowedAttributes.get(attributeName).putValue(value);
        }
    }

    putChild(tag) {
        this.#allowedChildTags.add(tag);
    }

    putContent(content) {
        this.#allowedContents.add(content);
    }
}

class AttributeDescriptor {

    #name;

    #encounteredValues = new Set();

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    /** @return string[] */
    get encounteredValues() {
        return Array.from(this.#encounteredValues.values());
    }

    putValue(value) {
        this.#encounteredValues.add(value);
    }
}

export default class AnalysisData {

    #tagDescriptors = new Map();

    /** @return TagDescriptor[] */
    get tags() {
        return Array.from(this.#tagDescriptors.values());
    }

    putTag(tagName) {
        if (this.#tagDescriptors.has(tagName)) {
            return;
        }

        let tag = new TagDescriptor(tagName);

        this.#tagDescriptors.set(tagName, tag);
    }

    putAttribute(ownerTagName, attributeName, value = null) {
        let ownerTag = this.#tagDescriptors.get(ownerTagName);

        ownerTag.putAttribute(attributeName, value);
    }

    putChild(ownerTagName, childTagName) {
        let ownerTag = this.#tagDescriptors.get(ownerTagName);
        let childTag = this.#tagDescriptors.get(childTagName);

        ownerTag.putChild(childTag);
    }

    putContent(ownerTagName, content) {
        let ownerTag = this.#tagDescriptors.get(ownerTagName);

        ownerTag.putContent(content);
    }
}