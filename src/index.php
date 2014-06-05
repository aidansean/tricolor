<?php
$title = 'Tricolor cells' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('tricolor.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
</style>
<script type="text/ecmascript" src="tricolor.js"></script>
<title><?php echo $title ; ?></title>
</head>
<body lang="en" onload="start()">
<?php include($_SERVER['DOCUMENT_ROOT'] . '/head_2.php') ; ?>
<p>
  This page runs a mathematical model known as Rock-Paper-Scissors.  Cellular automata eat each other with a cyclical food chain.  This results in pretty patterns.</p>
<p>
  <input type="submit" id="button_start" value="Start"/>
  <input type="submit" id="button_stop"  value="Stop" />
  <input type="submit" id="button_reset" value="Reset"/>
  Turn <span id="turn_counter">0</span>
</p>
  <p>Delay: <input type="text" id="input_delay" />ms <input type="submit" id="button_delay" value="Change"/></p>
  <p>Density: <input type="text" id="input_dust" /> <input type="submit" id="button_dust" value="Random dust"/></p>
<p>
</p>
<div id="extra_content_wrapper"></div>

<div id="canvas_wrapper">
  <canvas id="life_canvas" width="700" height="700"></canvas>
</div>

<?php foot() ; ?>
