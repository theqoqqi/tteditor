<?
session_start();
require_once 'utils.php';

$relativePath = $_GET['relative_path'];

echo file_get_contents(getWorkspacePath() . '/' . $relativePath);