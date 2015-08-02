<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/tricolor" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=tricolor" ;
$project = new project_object("tricolor", "Tricolor", "https://github.com/aidansean/tricolor", "http://aidansean.com/projects/?tag=tricolor", "tricolor/images/project.jpg", "tricolor/images/project_bw.jpg", "While investigating Conway's game of life I wanted to see if I could easily extend the framework I'd developed to explore other systems.  One of the more interesting cellular automata is the rock-paper-scissors system where three populations feed on each other.", "Toys", "canvas,HTML,JavaScript") ;
?>