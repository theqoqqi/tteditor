<?
session_start();
require_once 'utils.php';

$filename = $_POST['filename'];
$levelXml = $_POST['level_xml'];

$workspacePath = getWorkspacePath();
$isValid = isValidWorkspacePath($workspacePath);

if (!$isValid) {
    echo json_encode([
        'status' => 'ERROR',
    ]);
    exit;
}

$filename = getWorkspacePath() . '/' . $filename;

if (!ensureDir(dirname($filename))) {
    echo json_encode([
        'status' => 'ERROR',
    ]);
    exit;
}

$result = file_put_contents($filename, $levelXml);

echo json_encode([
    'status' => 'OK',
    'result' => $result,
    'filename' => $filename,
]);
