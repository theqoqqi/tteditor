<?
session_start();
require_once 'utils.php';

$workspacePath = $_POST['path'];
$isValid = isValidWorkspacePath($workspacePath);

if ($isValid) {
    setWorkspacePath($workspacePath);
}

echo json_encode([
    'status' => $isValid ? 'OK' : 'ERROR',
]);
