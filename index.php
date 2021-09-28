<!doctype html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport'
          content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'>
    <meta http-equiv='X-UA-Compatible' content='ie=edge'>
    <title>Totem Tribe Editor</title>
    <link rel='stylesheet' href='css/reset.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css' />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/codemirror.min.css'/>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/material-darker.min.css'/>
    <link rel='stylesheet' href='css/style.css' />
    <script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.min.js'></script>
    <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>
    <script src='https://code.jquery.com/jquery-migrate-3.0.0.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js'></script>
    <script src='https://unpkg.com/scrollbooster@3.0.2/dist/scrollbooster.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/codemirror.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/mode/xml/xml.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/addon/selection/active-line.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/addon/edit/matchbrackets.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/addon/edit/matchtags.min.js'></script>
    <script src='utils.js'></script>
    <script src='matrix.js'></script>
</head>
<?
session_start();
require_once 'utils.php';
require_once 'print_utils.php';
?>
<body>
<div class='page-root'>
    <?
    printSidebar('left-sidebar', [
        [
            'id' => 'level-list-sidebar-tab',
            'icon' => 'bi-folder-fill',
            'title' => 'Список карт',
            'content' => fn () => printSidebarLevelListTab(),
        ],
        [
            'id' => 'palette-sidebar-tab',
            'icon' => 'bi-grip-vertical',
            'title' => 'Палитра',
            'content' => fn () => printSidebarPaletteTab(),
        ],
    ]);
    ?>
    <div class='main-area-container'>
        <div class='main-area-panels'>
            <div class='toolbar'>
                <div id='file-toolbar' class='toolbar-group'>
                    <div id='reset-level-button' class='toolbar-icon'>
                        <i class='bi-file-earmark-x-fill'></i>
                    </div>
                    <div id='save-level-button' class='toolbar-icon'>
                        <i class='bi-file-earmark-check-fill'></i>
                    </div>
                </div>
                <div class='toolbar-separator'></div>
                <div id='map-layer-list' class='toolbar-group map-layer-list'>
                    <!-- Injected by JS -->
                </div>
            </div>
            <div class='status-bar'>
                <div class='coords'>
                    pos: <span id='x-position'>0</span> <span id='y-position'>0</span>
                </div>
                <div class='status-bar-separator'></div>
                <div class='workspace'>
                    <label for='workspace-path-input' class='workspace-label'>
                        Путь:
                    </label>
                    <span id='workspace-path-span' class='workspace-path-span'></span>
                    <input id='workspace-path-input' class='workspace-path-input' />
                    <button id='edit-workspace-path-button' class='status-bar-button edit-workspace-path-button'>
                        Изменить
                    </button>
                    <button id='save-workspace-path-button' class='status-bar-button save-workspace-path-button'>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
        <div class='map-scroll-container'>
            <div class='map-scroll'>
                <div class='map-container'>
                    <div class='map'>
                        <div class='map-node-list'>
                            <!-- Injected by JS -->
                        </div>
                        <div class='map-border'></div>
                    </div>
                </div>
            </div>
            <div class='main-area-overlay'>

            </div>
        </div>
    </div>
    <?
    printSidebar('right-sidebar', [
        [
            'id' => 'node-list-sidebar-tab',
            'icon' => 'bi-grid-fill',
            'title' => 'Элементы',
            'content' => fn () => printSidebarNodeListTab(),
        ],
        [
            'id' => 'trigger-list-sidebar-tab',
            'icon' => 'bi-play-circle-fill',
            'title' => 'Триггеры',
            'content' => fn () => printSidebarTriggerListTab(),
        ],
        [
            'id' => 'map-options-sidebar-tab',
            'icon' => 'bi-border-outer',
            'title' => 'Карта',
            'content' => fn () => printSidebarMapOptionsTab(),
        ],
    ]);
    ?>
</div>
<script type='module'>
    import EditorContext from './cls/EditorContext.js';
    import MapEditor from './cls/MapEditor.js';
    import UINodeFactory from './cls/UINodeFactory.js';

    $(function () {
        let context = new EditorContext();
        let uiNodeFactory = new UINodeFactory(context);
        let mapEditor = new MapEditor(context, uiNodeFactory);
    });
</script>
</body>
</html>