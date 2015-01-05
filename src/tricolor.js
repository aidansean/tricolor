var canvas  = 0 ;
var context = 0 ;

var n_breeds   = 3 ;
var n_families = 2 ;

var colors = [] ;
colors.push([  0,  0,  0]) ;
colors.push([255,  0,  0]) ;
colors.push([  0,150,  0]) ;
colors.push([  0,  0,255]) ;
colors.push([150,150,  0]) ;
colors.push([255,  0,255]) ;
colors.push([  0,150,150]) ;

var base_health = 10 ; // Only used for rock paper scissors
var wrap = 0 ;
var decayTime = 500 ;
var show_health = false ;

// Control evolution duration and speed
var delay = 2 ;
var counter = 0 ;
var stop = 10000 ;
var paused = false ;
var dust_density = 0.05 ;
var draw_interval = 1 ;

// Dimensions of play area
var width  = 750 ;
var height = 750 ;
var cellSize = 10 ;
var nRows = floor(height/cellSize) ;
var nCols = floor( width/cellSize) ;

var cells          = [] ;
var nCellsPerBreed = [] ;

function fill_history_bar(){
  var canvas = Get('canvas_history') ;
  var context = canvas.getContext('2d') ;
  context.drawImage(canvas, -1, 0) ;
  var total = 0 ;
  for(var i=0 ; i<=n_breeds ; i++){
    total += nCellsPerBreed[i] ;
  }
  var nCum = 0 ;
  for(var i=0 ; i<=n_breeds ; i++){
    var nTmp = nCum ;
    nCum += nCellsPerBreed[i]*100/total ;
    context.fillStyle = 'rgb(' + colors[i][0] + ',' + colors[i][1] + ',' + colors[i][2] + ')' ;
    context.fillRect(canvas.width-1,nTmp,1,nCum-nTmp) ;
  }
}

// To be called if nRows or nCols changes
function remake_cells(){
  cells = [] ;
  nRows = floor(height/cellSize) ;
  nCols = floor( width/cellSize) ;
  for(var i=0 ; i<nRows ; i++){
    cells.push([]) ;
    for(var j=0 ; j<nCols ; j++){
      cells[i].push(new cell_object(i,j)) ;
    }
  }
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      cells[i][j].set_neighbours() ;
    }
  }
}
function rebuild(){
  write_population_table() ;
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      var value = 0 ;
      var breed = 0 ;
      if(random()<dust_density){
        value = floor(1+n_breeds*random()) ;
        breed = value ;
      }
      cells[i][j].current_breed  = breed ;
      cells[i][j].past_breed     = breed ;
      cells[i][j].current_health = base_health ;
      cells[i][j].past_health    = base_health ;
    }
  }
  turn_draw() ;
}

function get_cell_coords(i,j){
  if(wrap%2==1){
    if(i<0     ) i = nRows-1 ;
    if(i>=nRows) i = 0       ;
  }
  if(wrap>=2){
    if(j<0     ) j = nCols-1 ;
    if(j>=nCols) j = 0       ;
  }
  if(i<0 || i>=nRows) return [-1,-1] ;
  if(j<0 || j>=nCols) return [-1,-1] ;
  return [i,j] ;
}

function turn_begin(){
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      cells[i][j].past_breed  = cells[i][j].current_breed  ;
      cells[i][j].past_health = cells[i][j].current_health ;
    }
  }
}
function turn_run(){
  for(var i=0 ; i<=n_breeds ; i++){
    nCellsPerBreed[i] = 0 ;
  }
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      var c = cells[i][j] ;
      c.update() ;
      nCellsPerBreed[c.current_breed]++ ;
    }
  }
  for(var i=0 ; i<=n_breeds ; i++){
    var td = Get('td_n_'+i) ;
    td.innerHTML = nCellsPerBreed[i] ;
  }
}
function turn_draw(){
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      cells[i][j].draw() ;
    }
  }
}
function turn_end(){ return ; }
function turn(){
  if(paused) return ;
  turn_begin() ;
  turn_run() ;
  turn_draw() ;
  turn_end() ;
  Get('turn_counter').innerHTML = counter ;
  counter++ ;
  fill_history_bar() ;
  if(stop>0 && counter>=stop) return ;
  window.setTimeout(turn,delay,false) ;
}

function cell_object(u,v){
  this.u = u ;
  this.v = v ;
  this.current_breed  = 0 ;
  this.current_health = 0 ;
  this.past_breed  = 0 ;
  this.past_health = 0 ;
  this.age = 0 ;
  this.neighbours = [] ;
  this.set_neighbours = function(){
    this.neighbours = [] ;
    for(var di=-1 ; di<=1 ; di++){
      for(var dj=-1 ; dj<=1 ; dj++){
        if(di==0 && dj==0) continue ;
        var neighbour = get_cell_coords(this.u+di,this.v+dj) ;
        this.neighbours.push(neighbour) ;
      }
    }
  }
  this.update = function(){
    this.age++ ;
    if(this.age>decayTime) this.current_health-- ;
    if(this.current_health==0){
      this.current_breed  = 0 ;
      this.current_health = base_health ;
      this.age = 0 ;
      return ;
    }
    var nCoords = this.neighbours[ floor(this.neighbours.length*random()) ] ;
    if(nCoords[0]==-1) return ;
    var other = cells[nCoords[0]][nCoords[1]]
    var breed = this.past_breed ;
    var other_breed  = other.past_breed  ;
    var other_health = other.past_health ;
    if(other_breed==0) return ;
    if(breed==0){
      if(other_breed!=0 && other_health>1){
        var white_health = other_health-1 ;
        if(white_health==0) white_health = 1 ;
        this.current_breed  = other_breed  ;
        this.current_health = white_health ;
        return ;
      }
    }
    else{
      var eaten = false ;
      var nom   = false ;
      if((breed+n_breeds+1)%n_breeds==(other_breed+n_breeds)%n_breeds) eaten = true ;
      if((breed+n_breeds-1)%n_breeds==(other_breed+n_breeds)%n_breeds) nom   = true ;
      if(n_families==2 && n_breeds==6){
        // For two families of tricolors only
        // Reset feeding information
        eaten = false ;
        nom   = false ;
        if(breed>=1 && breed<=3){
          if(other_breed>=4 && other_breed<=6) return ; // Nothing to see here
          if(breed==1 && other_breed==2) eaten = true ;
          if(breed==2 && other_breed==3) eaten = true ;
          if(breed==3 && other_breed==1) eaten = true ;
          if(breed==1 && other_breed==3) nom   = true ;
          if(breed==2 && other_breed==1) nom   = true ;
          if(breed==3 && other_breed==2) nom   = true ;
        }
        else if(breed>=4 && breed<=6){
          if(other_breed>=1 && other_breed<=3) return ; // Nothing to see here
          if(breed==4 && other_breed==5) eaten = true ;
          if(breed==5 && other_breed==6) eaten = true ;
          if(breed==6 && other_breed==4) eaten = true ;
          if(breed==4 && other_breed==6) nom   = true ;
          if(breed==5 && other_breed==4) nom   = true ;
          if(breed==6 && other_breed==5) nom   = true ;
        }
      }
      if(eaten){
        // Get eaten by neighbour
        this.current_health = this.past_health-1 ;
        if(this.current_health>1){
          return ;
        }
        else{
          this.current_breed  = other_breed ;
          this.age = 0 ;
          if(other_health>1){
            this.current_health = other_health-1 ;
            return ;
          }
          else{
            this.current_health = other_health ;
            return ;
          }
        }
      }
      if(nom){
        // Eat neighbour
        this.current_health++ ;
        if(this.current_health>base_health) this.current_health = base_health ;
        return ;
      }
    }
  }
  this.draw = function(){
    if(counter%draw_interval!=0) return ;
    var f = (show_health) ? this.current_health/base_health : 1.0 ;
    var rgb = colors[this.current_breed] ;
    var r = floor(f*rgb[0]) ;
    var g = floor(f*rgb[1]) ;
    var b = floor(f*rgb[2]) ;
    var color = 'rgb(' + r + ',' + g + ',' + b + ')' ;
    context.fillStyle = color ;
    var cs = cellSize ;
    context.fillRect(cs*this.u, cs*this.v, cs, cs)
  }
}

function start_life(){
  paused = false ;
  turn() ;
}
function stop_life(){
  paused = true ;
}

function change_nBreeds(){
  var nBreeds = Get('select_nBreeds').value ;
  var parts = nBreeds.split('x') ;
  n_breeds   = parseInt(parts[0]) ;
  n_families = parseInt(parts[1]) ;
  rebuild() ;
}
function change_delay(){
  var delay_in = parseInt(Get('input_delay').value) ;
  if(delay_in==NaN) return ;
  delay = delay_in ;
}
function change_cellSize(){
  var cellSize_in = parseInt(Get('input_cellSize').value) ;
  if(cellSize_in==NaN) return ;
  cellSize = cellSize_in ;
  remake_cells() ;
  change_dust() ;
  rebuild() ;
}
function change_wrap(){
  var wrap_in = Get('select_wrap').value ;
  if(wrap_in=='0') wrap = 0 ;
  if(wrap_in=='1') wrap = 1 ;
  if(wrap_in=='2') wrap = 2 ;
  if(wrap_in=='3') wrap = 3 ;
  for(var i=0 ; i<nCols ; i++){
    for(var j=0 ; j<nRows ; j++){
      cells[i][j].set_neighbours() ;
    }
  }
}
function change_health(){
  var health_in = Get('select_health').value ;
  if(health_in=='on' ) show_health = true  ;
  if(health_in=='off') show_health = false ;
}
function change_baseHealth(){
  var baseHealth_in = parseInt(Get('input_baseHealth').value) ;
  if(baseHealth_in==NaN || baseHealth_in<2) return ;
  base_health = baseHealth_in ;
}
function change_decayTime(){
  var decayTime_in = Get('input_decayTime').value ;
  if(decayTime_in==NaN || baseHealth_in<2) return ;
  decayTime = decayTime_in ;
}
function change_dust(){
  var dust_in = parseFloat(Get('input_dust').value) ;
  if(dust_in==NaN) return ;
  dust_density = dust_in ;
  if(dust_density<0) dust_density = 0 ;
  if(dust_density>1) dust_density = 1 ;
  rebuild() ;
}

function start(){
  canvas  = Get('canvas_main') ;
  context = canvas.getContext('2d') ;
  
  Get('input_delay'     ).value = delay        ;
  Get('input_dust'      ).value = dust_density ;
  Get('input_cellSize'  ).value = cellSize     ;
  Get('input_baseHealth').value = base_health  ;
  Get('input_decayTime' ).value = decayTime    ;
  
  Get('button_start'     ).addEventListener('click', start_life       , false) ;
  Get('button_stop'      ).addEventListener('click', stop_life        , false) ;
  Get('button_delay'     ).addEventListener('click', change_delay     , false) ;
  Get('button_dust'      ).addEventListener('click', change_dust      , false) ;
  Get('button_nBreeds'   ).addEventListener('click', change_nBreeds   , false) ;
  Get('button_wrap'      ).addEventListener('click', change_wrap      , false) ;
  Get('button_health'    ).addEventListener('click', change_health    , false) ;
  Get('button_cellSize'  ).addEventListener('click', change_cellSize  , false) ;
  Get('button_baseHealth').addEventListener('click', change_baseHealth, false) ;
  Get('button_decayTime' ).addEventListener('click', change_decayTime , false) ;
  
  for(var i=0 ; i<n_breeds ; i++){ nCellsPerBreed.push(0) ; }
  write_population_table() ;
  
  stop = -1 ;
  remake_cells() ;
  change_dust() ;
  turn_draw() ;
}

function write_population_table(){
  var tbody = Get('tbody_population') ;
  tbody.innerHTML = '' ;
  for(var i=0 ; i<=n_breeds ; i++){
    var tr = Create('tr') ;
    var td = Create('td') ;
    td.innerHTML = 0 ;
    var color = 'rgb(' + colors[i][0] + ',' + colors[i][1] + ',' + colors[i][2] + ')' ;
    td.style.background = color ;
    td.style.color = 'white' ;
    td.id = 'td_n_' + i ;
    td.className = 'population' ;
    td.style.width = 100/(1+n_breeds) + '%' ;
    tr.appendChild(td) ;
    tbody.appendChild(tr) ;
  }
}

function random(){ return Math.random() ; }
function floor(x){ return Math.floor(x) ; }
function Get(id){ return document.getElementById(id) ; }
function Create(type){ return document.createElement(type) ; }
