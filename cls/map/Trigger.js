
export default class Trigger {

    constructor(title) {
        this.title = title;
        this.repeat = false;
        this.statements = [];
    }

    hasStatementOfType(tagName) {
        return this.statements.some(statement => statement.includes('<' + tagName));
    }

    getStatementsOfType(tagName) {
        return this.statements.filter(statement => statement.includes('<' + tagName));
    }

    removeAllStatementsOfType(tagName) {
        let statements = this.getStatementsOfType(tagName);

        for (const statement of statements) {
            this.removeStatement(statement);
        }
    }

    addStatement(statement) {
        this.statements.push(statement);
    }

    removeStatement(statement) {
        let index = this.statements.indexOf(statement);
        if (index !== -1) {
            this.statements.splice(index, 1);
        }
    }
}