<?
session_start();
require_once 'utils.php';

$imageSizes = getAllImageSizes();

echo json_encode($imageSizes);