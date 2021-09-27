<?
session_start();
require_once 'utils.php';

$levels = getAllLevels();

echo json_encode($levels);