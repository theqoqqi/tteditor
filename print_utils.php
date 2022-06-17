<?
require_once 'utils.php';

function printSidebarLevelListTab() {
    ?>
    <div id='level-list' class='level-list list-group'>
        <!-- Injected by JS -->
    </div>
    <?
}

function printSidebarPaletteTab() {
    $tabs = [
        [
            'id' => 'terrains-tab',
            'icon' => 'bi-square-fill',
            'title' => 'Ландшафт',
            'content' => function () {
                printPaletteTab('terrain');
            },
        ],
        [
            'id' => 'landmarks-tab',
            'icon' => 'bi-layers-fill',
            'title' => 'Ландмарки',
            'content' => function () {
                printPaletteTab('landmark');
            },
        ],
        [
            'id' => 'structures-tab',
            'icon' => 'bi-tree-fill',
            'title' => 'Объекты',
            'content' => function () {
                printPaletteTab('structure');
            },
        ],
        [
            'id' => 'buildings-tab',
            'icon' => 'bi-house-fill',
            'title' => 'Здания',
            'content' => function () {
                printPaletteTab('building');
            },
        ],
        [
            'id' => 'units-tab',
            'icon' => 'bi-person-fill',
            'title' => 'Юниты',
            'content' => function () {
                printPaletteTab('unit');
            },
        ],
        [
            'id' => 'items-tab',
            'icon' => 'bi-search',
            'title' => 'Предметы',
            'content' => function () {
                printPaletteTab('item');
            },
        ],
        [
            'id' => 'magics-tab',
            'icon' => 'bi-stars',
            'title' => 'Магия',
            'content' => function () {
                printPaletteTab('magic');
            },
        ],
        [
            'id' => 'triggers-tab',
            'icon' => 'bi-record2',
            'title' => 'Триггеры',
            'content' => function () {
                printPaletteTab('trigger');
            },
        ],
    ];

    printTabbablePanel([
        'panel_id' => 'palette',
        'panel_classes' => 'palette',
        'tab_links_classes' => 'palette-tab-links',
        'tab_link_classes' => 'palette-tab-link',
        'tabs_classes' => 'palette-tabs',
        'tab_classes' => 'palette-tab',
        'toggle_type' => 'tab',
        'tabs' => $tabs,
        'link_content' => function ($tab) { ?>
            <i class='<?= $tab['icon'] ?>'></i>
            <span class='title'><?= $tab['title'] ?></span>
        <? },
    ]);
}

function printPaletteTab($configName) {
    ?>
    <div class='palette-item-list' data-config-name='<?= $configName ?>'>
        <!-- Injected by JS -->
    </div>
    <?
}

function printSidebarCommandListTab() {
    ?>
    <div id='command-list' class='command-list'>
        <!-- Injected by JS -->
    </div>
    <?
}

function printSidebarNodeListTab() {
    ?>
    <div id='node-list' class='node-list'>
        <!-- Injected by JS -->
    </div>
    <div class='node-properties'>
        <div class='panel-header'>
            <i class='bi-gear-fill'></i>
            Свойства объекта
        </div>
        <div id='property-list' class='property-list'>
            <?
            printPropertyControl([
                'title' => 'Класс',
                'control_name' => 'tag',
                'property' => [
                    'type' => 'text',
                    'name' => 'tag',
                    'readonly' => true,
                ],
            ]);
            printPropertyControl([
                'title' => 'Тип',
                'control_name' => 'type',
                'property' => [
                    'type' => 'text',
                    'name' => 'type',
                    'readonly' => true,
                ],
            ]);
            printPropertyControl([
                'title' => 'Имя',
                'control_name' => 'name',
                'property' => [
                    'type' => 'text',
                    'name' => 'name',
                ],
            ]);
            printPropertyControl([
                'title' => 'ID',
                'control_name' => 'subId',
                'property' => [
                    'type' => 'number',
                    'name' => 'subId',
                ],
            ]);
            printPropertyControl([
                'title' => 'Группа',
                'control_name' => 'group',
                'property' => [
                    'type' => 'text',
                    'name' => 'group',
                ],
            ]);
            printPropertyControl([
                'title' => 'Позиция',
                'control_name' => 'position',
                'properties' => [
                    [
                        'type' => 'number',
                        'name' => 'x',
                    ],
                    [
                        'type' => 'number',
                        'name' => 'y',
                    ],
                ],
            ]);
            printPropertyControl([
                'title' => 'Радиус',
                'control_name' => 'radius',
                'property' => [
                    'type' => 'number',
                    'name' => 'radius',
                ],
            ]);
            printPropertyControl([
                'title' => 'Владелец',
                'control_name' => 'owner',
                'property' => [
                    'type' => 'text',
                    'name' => 'owner',
                ],
            ]);
            printPropertyControl([
                'title' => 'Подсказка',
                'control_name' => 'hint',
                'property' => [
                    'type' => 'text',
                    'name' => 'hint',
                ],
            ]);
            ?>
        </div>
    </div>
    <?
}

function printSidebarTriggerListTab() {
    ?>
    <div class='trigger-list-controls property-list'>
        <div class='property'>
            <div>
                <?
                printPropertyInput([
                    'type' => 'text',
                    'name' => 'title',
                    'attributes' => [
                        'id' => 'new-trigger-title-input',
                        'placeholder' => 'Добавить триггер...',
                    ],
                ]);
                ?>
                <i id='add-new-trigger-button' class='icon-button bi-plus-circle-fill'></i>
            </div>
        </div>
    </div>
    <div id='trigger-list' class='trigger-list'>
        <!-- Injected by JS -->
    </div>
    <div class='trigger-properties'>
        <div class='panel-header'>
            <i class='bi-play-circle-fill'></i>
            Редактор триггера
        </div>
        <div id='trigger-property-list' class='property-list'>
            <?
            printPropertyControl([
                'title' => 'Название',
                'control_name' => 'i',
                'property' => [
                    'type' => 'text',
                    'name' => 'i',
                    'attributes' => [
                        'id' => 'trigger-title-input',
                    ],
                ],
            ]);
            ?>
        </div>
        <div class='trigger-editor-container'>
            <div id='trigger-editor' class='trigger-editor'></div>
        </div>
    </div>
    <?
}

function printSidebarMapOptionsTab() {
    ?>
    <div id='map-options' class='map-options property-list'>
        <?
        printPropertyControl([
            'title' => 'ID',
            'control_name' => 'id',
            'properties' => [
                [
                    'type' => 'number',
                    'name' => 'id',
                    'source' => 'options',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'idEnabled',
                    'checksProperties' => ['id'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Музыка',
            'control_name' => 'music',
            'properties' => [
                [
                    'type' => 'text',
                    'name' => 'music',
                    'source' => 'options',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'musicEnabled',
                    'checksProperties' => ['music'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Coloring',
            'control_name' => 'coloring',
            'properties' => [
                [
                    'type' => 'text',
                    'name' => 'coloring',
                    'source' => 'options',
                    'mode' => 'color',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'coloringEnabled',
                    'checksProperties' => ['coloring'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Цвет разведанного',
            'control_name' => 'fowClearColor',
            'properties' => [
                [
                    'type' => 'text',
                    'name' => 'fowClearColor',
                    'source' => 'options',
                    'mode' => 'color',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'fowClearColorEnabled',
                    'checksProperties' => ['fowClearColor'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Размер',
            'control_name' => 'size',
            'properties' => [
                [
                    'type' => 'number',
                    'name' => 'width',
                    'source' => 'map',
                ],
                [
                    'type' => 'number',
                    'name' => 'height',
                    'source' => 'map',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'sizeEnabled',
                    'checksProperties' => ['width', 'height'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Старт',
            'control_name' => 'start',
            'properties' => [
                [
                    'type' => 'number',
                    'name' => 'startX',
                    'source' => 'map',
                ],
                [
                    'type' => 'number',
                    'name' => 'startY',
                    'source' => 'map',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'startEnabled',
                    'checksProperties' => ['startX', 'startY'],
                ],
            ],
        ]);
        printPropertyControl([
            'title' => 'Позиция базы',
            'control_name' => 'playerBase',
            'properties' => [
                [
                    'type' => 'number',
                    'name' => 'playerBaseX',
                    'source' => 'map',
                ],
                [
                    'type' => 'number',
                    'name' => 'playerBaseY',
                    'source' => 'map',
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'playerBaseEnabled',
                    'checksProperties' => ['playerBaseX', 'playerBaseY'],
                ],
            ],
        ]);
        ?>
    </div>
    <div class='randomizer-options-container'>
        <div class='panel-header'>
            <i class='bi-patch-question-fill'></i>
            Рандомайзеры
        </div>
        <div id='randomizer-list' class='randomizer-list property-list'>

        </div>
        <div class='new-randomizer-panel property-list'>
            <div class='property' data-control-name=''>
                <div class='new-randomizer-input-container'>
                    <?
                    printPropertyInput([
                        'type' => 'text',
                        'value' => null,
                        'attributes' => [
                            'id' => 'new-randomizer-type-input',
                            'placeholder' => 'Имя объекта',
                        ],
                    ]);
                    ?>
                </div>
                <div>
                    <?
                    printPropertyInput([
                        'type' => 'number',
                        'value' => null,
                        'attributes' => [
                            'id' => 'new-randomizer-count-input',
                            'placeholder' => 'Количество',
                            'min' => 0,
                        ],
                    ]);
                    ?>
                    <i id='add-new-randomizer-button' class='icon-button bi-plus-circle-fill'></i>
                </div>
            </div>
        </div>
    </div>
    <?
}

function printSidebar($sidebarId, $tabs) {
    printTabbablePanel([
        'panel_id' => $sidebarId,
        'panel_classes' => "sidebar $sidebarId",
        'tab_links_classes' => 'sidebar-tab-links',
        'tab_link_classes' => 'sidebar-tab-link',
        'tabs_classes' => 'sidebar-tabs',
        'tab_classes' => 'sidebar-tab',
        'toggle_type' => 'collapse',
        'tabs' => $tabs,
        'link_content' => function ($tab) { ?>
            <span class='title'><?= $tab['title'] ?></span>
            <i class='<?= $tab['icon'] ?>'></i>
        <? },
    ]);
}

function printTabbablePanel($options) {
    $panelId = $options['panel_id'];
    $panelClasses = $options['panel_classes'];
    $tabLinksClasses = $options['tab_links_classes'];
    $tabLinkClasses = $options['tab_link_classes'];
    $tabsClasses = $options['tabs_classes'];
    $tabClasses = $options['tab_classes'];
    $toggleType = $options['toggle_type'];
    $tabs = $options['tabs'];
    $linkContent = $options['link_content'];

    if ($toggleType === 'tab') {
        $panelClasses .= ' tabbable-tabs';
        $tabsClasses .= ' tab-content';
        $tabClasses .= ' tab-pane';
    }

    if ($toggleType === 'collapse') {
        $panelClasses .= ' tabbable-accordion';
        $tabLinkClasses .= ' collapsed';
        $tabClasses .= ' collapse';
    }
    ?>
    <div id='<?= $panelId ?>' class='tabbable <?= $panelClasses ?>'>
        <nav class='nav nav-tabs <?= $tabLinksClasses ?>'>
            <? foreach ($tabs as $tab) {
                printTabLink($tabLinkClasses, $tab['id'], $toggleType, fn () => $linkContent($tab));
            } ?>
        </nav>
        <div class='<?= $tabsClasses ?>'>
            <? foreach ($tabs as $tab) {
                $classes = $tabClasses . ' ' . $tab['id'];
                printTab($classes, $tab['id'], $panelId, $tab['content']);
            } ?>
        </div>
    </div>
    <?
}

function printTabLink($classes, $tabId, $toggleType, $contentCallback) {
    ?>
    <a class='<?= $classes ?>' data-bs-toggle='<?= $toggleType ?>' data-bs-target='#<?= $tabId ?>'>
        <? $contentCallback() ?>
    </a>
    <?
}

function printTab($classes, $tabId, $parentId, $contentCallback) {
    ?>
    <div id='<?= $tabId ?>'
         class='<?= $classes ?>'
         data-bs-parent='#<?= $parentId ?>'>
        <? $contentCallback() ?>
    </div>
    <?
}

function printPropertyControl($options) {
    $title = $options['title'];
    $controlName = $options['control_name'];
    $properties = $options['properties'] ?? [$options['property']];
    $propertyIdString = uniqid('property-', true);
    ?>
    <div class='property' data-control-name='<?= $controlName ?>'>
        <label id='<?= $propertyIdString ?>'>
            <?= $title ?>
        </label>
        <div>
            <? foreach ($properties as $property) {
                printPropertyInput($property);
            } ?>
        </div>
    </div>
    <?
}

function printPropertyInput($property) {
    $idString = $property['label_id'];
    $classes = $property['type'] === 'checkbox' ? 'form-check-input' : 'form-control';
    $value = array_key_exists('value', $property) ? $property['value'] : ($property['type'] === 'number' ? 0 : '');
    $attributes = arrayToAttributes($property['attributes'] ?? []);
    ?>
    <input <?= $property['readonly'] ? 'readonly' : '' ?> <?= $attributes ?>
        type='<?= $property['type'] ?>'
        value='<?= $value ?>'
        class='property-input <?= $classes ?>'
        aria-label='<?= $idString ?>'
        data-property='<?= $property['name'] ?>'
        data-mode='<?= $property['mode'] ?>'
        data-options='<?= json_encode($property) ?>' />
    <?
}

function arrayToAttributes(array $attributes): string {
    $attributeStrings = [];

    foreach ($attributes as $key => $value) {
        $attributeStrings[] = createAttributeString($key, $value);
    }

    return implode(' ', $attributeStrings);
}

function createAttributeString($key, $value): string {
    return "$key='$value'";
}
