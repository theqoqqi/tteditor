<?

function isValidWorkspacePath($workspacePath): bool {
    return is_dir($workspacePath) && is_dir($workspacePath . '/data/level/original');
}

function setWorkspacePath($workspacePath) {
    $_SESSION['workspace_path'] = str_replace('\\', '/', $workspacePath);
}

function getWorkspacePath() {
    return $_SESSION['workspace_path'] ?? null;
}

function getAllImageSizes(): array {
    $allTextures = getAllFilesInDirectory(getWorkspacePath() . '/data/texture');
    $imageSizes = [];

    foreach ($allTextures as $texture) {
        [$width, $height] = getimagesize($texture);
        $imageSizes[strtolower(relativize($texture))] = [
            'width' => $width,
            'height' => $height,
        ];
    }

    return $imageSizes;
}

function getAllLevels(): array {
    $levels = getAllCampaignLevels();
    $filenames = getAllFilesInDirectory(getWorkspacePath() . '/data/level/original');
    $campaignLevelFilenames = array_column($levels, 'path');

    foreach ($filenames as $filename) {
        $filename = relativize($filename);
        if (in_array($filename, $campaignLevelFilenames)) {
            continue;
        }
        $levels[] = [
            'id' => null,
            'map_name' => 'Unused: ' . basename($filename),
            'path' => $filename,
        ];
    }

    return $levels;
}

function getAllCampaignLevels(): array {
    $dom = new DOMDocument();
    $dom->loadXML(file_get_contents(getWorkspacePath() . '/data/cfg/campaign.xml'));
    $xpath = new DOMXPath($dom);

    $levels = [];

    foreach ($xpath->query('/campaign/level') as $levelDom) {
        if ($xpath->evaluate('boolean(fake)', $levelDom)) {
            continue;
        }
        $levels[] = [
            'id' => (int) $levelDom->getAttribute('id'),
            'map_name' => localizeNodeText($levelDom, 'hint'),
            'path' => getChildText($levelDom, 'path'),
        ];
    }

    return $levels;
}

function getLocalizedString($path) {
    $localeDom = getLocaleDom();

    $path = ltrim($path, '$');
    $parts = explode('.', $path);
    $result = $localeDom;
    while (count($parts) > 0 && $result) {
        $result = findChildByTagName($result, array_shift($parts));
    }
    if (!$result) {
        return null;
    }
    return preg_replace('/#{!0x\w{8}}/i', '', $result->textContent);
}

function getLocaleDom() {
    if (empty($GLOBALS['LOCALE_DOM'])) {
        $GLOBALS['LOCALE_DOM'] = loadDom(getWorkspacePath() . '/data/language/Russian-1251.xml');
    }
    return $GLOBALS['LOCALE_DOM'];
}

function loadDom($relativePath): DOMDocument {
    $dom = new DOMDocument();
    $dom->loadXML(file_get_contents($relativePath));
    return $dom;
}

function findChildByTagName(DOMNode $dom, $tagName): ?DOMNode {
    foreach ($dom->childNodes as $child) {
        if ($child->nodeName === $tagName) {
            return $child;
        }
    }
    return null;
}

function getChildText($dom, $tagName): ?string {
    $child = findChildByTagName($dom, $tagName);
    return $child->textContent ?? null;
}

function localizeNodeText($dom, $tagName) {
    $child = findChildByTagName($dom, $tagName);
    return $child ? getLocalizedString($child->textContent) : null;
}

function getAllFilesInDirectory($dir, &$results = array()) {
    $files = scandir($dir);

    foreach ($files as $key => $value) {
        $relativePath = $dir . '/' . $value;
        $path = realpath($relativePath);
        if (!is_dir($path)) {
            $results[] = $relativePath;
        } else if ($value !== '.' && $value !== '..') {
            getAllFilesInDirectory($relativePath, $results);
//            $results[] = $path;
        }
    }

    return $results;
}

function relativize($filename) {
    return substr($filename, strlen(getWorkspacePath() . '/'));
}

function ensureDir($dir): bool {
    $dir = asAbsolutePath($dir);
    return is_dir($dir) || (mkdir($dir, 0777, true) && is_dir($dir));
}

function asAbsolutePath($dir) {
    if ($dir && $dir[0] === '/' && strpos($dir, $_SERVER['DOCUMENT_ROOT']) === false) {
        $dir = $_SERVER['DOCUMENT_ROOT'] . $dir;
    }
    return $dir;
}