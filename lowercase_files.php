<?
/**
 * @author: Qoqqi
 * 27.09.2021, 19:45
 */
$path = realpath('./data/texture');

$di = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach($di as $name => $fio) {
    $newname = $fio->getPath() . DIRECTORY_SEPARATOR . strtolower( $fio->getFilename() );
    rename($name, $newname);
    echo $name, ' -> ', $newname, "<br />";
}