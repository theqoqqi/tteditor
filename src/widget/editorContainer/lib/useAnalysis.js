import {Analyser, useEditor, useEditorContext} from '../../../shared/lib';
import {useWorkspace} from '../../../entities/workspace';
import {useEffect, useState} from 'react';
import {useAsync} from 'react-use';

export default function useAnalysis() {
    let editor = useEditor();
    let editorContext = useEditorContext();
    let { workspacePath } = useWorkspace();
    let [templateLevels, setTemplateLevels] = useState([]);
    let [analysis, setAnalysis] = useState(null);
    let [analysisJson, setAnalysisJson] = useState(null);
    let asyncLevelList = useAsync(() => editor.loadLevelList(), [editor, workspacePath]);

    useEffect(() => {
        let levels = asyncLevelList.value;

        if (!levels) {
            return;
        }

        (async () => {
            levels = levels.filter(level => !!level);

            let templateLevels = await Promise.all(levels.map(async level => {
                try {
                    return await editorContext.loadTemplateXml(level.path);
                } catch (e) {
                    return null;
                }
            }));

            setTemplateLevels(templateLevels.filter(level => level !== null));
        })();
    }, [editorContext, asyncLevelList]);

    useEffect(() => {
        if (!templateLevels) {
            return;
        }

        let analyser = new Analyser();

        for (const levelXml of templateLevels) {
            let xml = levelXml.querySelector('triggers');

            analyser.analyse(xml);
        }

        setAnalysis(analyser.getResults());

    }, [templateLevels]);

    useEffect(() => {
        if (!analysis) {
            return;
        }

        let json = {
            tags: {},
        };

        for (const tag of analysis.tags) {
            let tagJson = {
                name: tag.name,
                attributes: {},
                childTags: {},
                contents: tag.allowedContents,
            };
            json.tags[tag.name] = tagJson;

            for (const attribute of tag.allowedAttributes) {
                let attributeJson = {
                    name: attribute.name,
                    values: attribute.encounteredValues,
                };

                tagJson.attributes[attribute.name] = attributeJson;
            }
        }

        for (const tag of analysis.tags) {
            for (const childTag of tag.allowedChildren) {
                let owner = json.tags[tag.name];
                let child = json.tags[childTag.name];

                owner.childTags[child.name] = child;
            }
        }

        setAnalysisJson(json);

    }, [analysis]);

    return analysisJson;
}
