<!doctype html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport'
          content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'>
    <meta http-equiv='X-UA-Compatible' content='ie=edge'>
    <title>Totem Tribe Editor</title>
    <link rel='stylesheet' type='text/css' href='css/reset.css' />
    <link rel='stylesheet' type='text/css' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css' />
    <link rel='stylesheet' type='text/css' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css' />
    <link rel='stylesheet' type='text/css' href='css/style.css' />
    <script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.min.js'></script>
<!--    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js'></script>-->
    <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>
    <script src='https://code.jquery.com/jquery-migrate-3.0.0.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js'></script>
    <script src='https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js'></script>
    <script src='utils.js'></script>
    <script src='matrix.js'></script>
</head>
<body>
<!doctype html>

<title>CodeMirror: Theme Demo</title>
<meta charset="utf-8"/>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/codemirror.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/3024-day.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/3024-night.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/abbott.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/abcdef.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/ambiance.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/ayu-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/ayu-mirage.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/base16-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/bespin.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/base16-light.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/blackboard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/cobalt.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/colorforth.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/dracula.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/duotone-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/duotone-light.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/eclipse.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/elegant.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/erlang-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/gruvbox-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/hopscotch.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/icecoder.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/isotope.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/juejin.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/lesser-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/liquibyte.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/lucario.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/material.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/material-darker.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/material-palenight.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/material-ocean.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/mbo.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/mdn-like.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/midnight.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/monokai.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/moxer.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/neat.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/neo.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/night.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/nord.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/oceanic-next.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/panda-syntax.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/paraiso-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/paraiso-light.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/pastel-on-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/railscasts.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/rubyblue.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/seti.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/shadowfox.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/solarized.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/the-matrix.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/tomorrow-night-bright.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/tomorrow-night-eighties.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/ttcn.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/twilight.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/vibrant-ink.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/xq-dark.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/xq-light.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/yeti.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/idea.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/darcula.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/yonce.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/theme/zenburn.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/codemirror.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/mode/xml/xml.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/addon/selection/active-line.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/addon/edit/matchbrackets.js"></script>
<style>
    .CodeMirror {border: 1px solid black; font-size:13px}
</style>
<div id=nav>
    <a href="https://codemirror.net"><h1>CodeMirror</h1><img id=logo src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/doc/logo.png"></a>

    <ul>
        <li><a href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/index.html">Home</a>
        <li><a href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.0/doc/manual.html">Manual</a>
        <li><a href="https://github.com/codemirror/codemirror">Code</a>
    </ul>
    <ul>
        <li><a class=active href="#">Theme</a>
    </ul>
</div>

<article>
    <h2>Theme Demo</h2>
    <form><textarea id="code" name="code">
<if_has>
    <unit/>
    <side>player</side>
    <at_area name="near_tear" />
</if_has>
<if_not_switch name="art_found" />
<reveal_map>
    <at_area name="tear" />
    <radius>200</radius>
</reveal_map>
<suspend_scroll/>
<focus_riddle/>
<scroll_view>
    <at_area name="tear" />
</scroll_view>
<wait_for_scroll/>
<resume_scroll/>
<popup text="$hierarchy.Level1.NearTear" />
<tutorial name="T_ITEM" />
</textarea></form>

    <p>Select a theme: <select onchange="selectTheme()" id=select>
            <option selected>default</option>
            <option>3024-day</option>
            <option>3024-night</option>
            <option>abbott</option>
            <option>abcdef</option>
            <option>ambiance</option>
            <option>ayu-dark</option>
            <option>ayu-mirage</option>
            <option>base16-dark</option>
            <option>base16-light</option>
            <option>bespin</option>
            <option>blackboard</option>
            <option>cobalt</option>
            <option>colorforth</option>
            <option>darcula</option>
            <option>dracula</option>
            <option>duotone-dark</option>
            <option>duotone-light</option>
            <option>eclipse</option>
            <option>elegant</option>
            <option>erlang-dark</option>
            <option>gruvbox-dark</option>
            <option>hopscotch</option>
            <option>icecoder</option>
            <option>idea</option>
            <option>isotope</option>
            <option>juejin</option>
            <option>lesser-dark</option>
            <option>liquibyte</option>
            <option>lucario</option>
            <option>material</option>
            <option>material-darker</option>
            <option>material-palenight</option>
            <option>material-ocean</option>
            <option>mbo</option>
            <option>mdn-like</option>
            <option>midnight</option>
            <option>monokai</option>
            <option>moxer</option>
            <option>neat</option>
            <option>neo</option>
            <option>night</option>
            <option>nord</option>
            <option>oceanic-next</option>
            <option>panda-syntax</option>
            <option>paraiso-dark</option>
            <option>paraiso-light</option>
            <option>pastel-on-dark</option>
            <option>railscasts</option>
            <option>rubyblue</option>
            <option>seti</option>
            <option>shadowfox</option>
            <option>solarized dark</option>
            <option>solarized light</option>
            <option>the-matrix</option>
            <option>tomorrow-night-bright</option>
            <option>tomorrow-night-eighties</option>
            <option>ttcn</option>
            <option>twilight</option>
            <option>vibrant-ink</option>
            <option>xq-dark</option>
            <option>xq-light</option>
            <option>yeti</option>
            <option>yonce</option>
            <option>zenburn</option>
        </select>
    </p>

    <script>
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true
        });
        var input = document.getElementById("select");
        function selectTheme() {
            var theme = input.options[input.selectedIndex].textContent;
            editor.setOption("theme", theme);
            location.hash = "#" + theme;
        }
        var choice = (location.hash && location.hash.slice(1)) ||
            (document.location.search &&
                decodeURIComponent(document.location.search.slice(1)));
        if (choice) {
            input.value = choice;
            editor.setOption("theme", choice);
        }
        CodeMirror.on(window, "hashchange", function() {
            var theme = location.hash.slice(1);
            if (theme) { input.value = theme; selectTheme(); }
        });
    </script>
</article>
</body>
</html>