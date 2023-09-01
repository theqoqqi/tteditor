import {useAsync} from 'react-use';
import useEditorContext from './useEditorContext';

export default function useNodeXml(tag, type) {
    let context = useEditorContext();
    let asyncNodeXml = useAsync(
        () => context.getNodeXmlByName(tag, type),
        [context, tag, type]
    );

    return asyncNodeXml.value;
}
