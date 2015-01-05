<?php
$title = 'Tricolor cells' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('tricolor.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<p>
  This page runs a mathematical model known as Rock-Paper-Scissors.  Cellular automata eat each other with a cyclical food chain.  This results in pretty patterns.
</p>

<div class="tab">
  <div class="tab_row">
    <div class="tab_cell">
      <table id="table_settings">
        <tbody>
          <tr>
            <th>Controls</th>
            <td>
              <input type="submit" id="button_start" value="Start"/>
              <input type="submit" id="button_stop"  value="Stop" />
            </td>
            <td></td>
          </tr>
          <tr>
            <th>Delay</th>
            <td><input type="text" id="input_delay" class="text"/> \(ms\)</td>
            <td><input type="submit" id="button_delay" value="Change"/></td>
          </tr>
          <tr>
            <th>Density</th>
            <td><input type="text" id="input_dust" class="text"/></td>
            <td><input type="submit" id="button_dust" value="Change"/></td>
          </tr>
          <tr>
            <th>Number of breeds</th>
            <td>
              <select id="select_nBreeds">
                <option value="2x1">2 breeds</option>
                <option value="3x1">3 breeds</option>
                <option value="4x1">4 breeds</option>
                <option value="5x1">5 breeds</option>
                <option value="6x1">6 breeds</option>
                <option value="6x2">6 breeds, two families</option>
              </select>
            </td>
            <td><input type="submit" id="button_nBreeds" value="Change"/></td>
          </tr>
          <tr>
            <th>Wrap around</th>
            <td>
              <select id="select_wrap">
                <option value="0">None</option>
                <option value="1">Horizontal</option>
                <option value="2">Vertical</option>
                <option value="3">Both</option>
              </select>
            </td>
            <td><input type="submit" id="button_wrap" value="Change"/></td>
          </tr>
          <tr>
            <th>Show cell health</th>
            <td>
              <select id="select_health">
                <option value="off">No</option>
                <option value="on">Yes</option>
              </select>
            </td>
            <td><input type="submit" id="button_health" value="Change"/></td>
          </tr>
          <tr>
            <th>Cell size</th>
            <td><input id="input_cellSize" class="text" /> \(px\)</td>
            <td><input type="submit" id="button_cellSize" value="Change"/></td>
          </tr>
          <tr>
            <th>Base health</th>
            <td><input id="input_baseHealth" class="text" /></td>
            <td><input type="submit" id="button_baseHealth" value="Change"/></td>
          </tr>
          <tr>
            <th>Decay time</th>
            <td><input id="input_decayTime" class="text"/> turns</td>
            <td><input type="submit" id="button_decayTime" value="Change"/></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tab_cell">
      <table id="table_population">
        <tbody>
          <tr>
            <td>Turn <span id="turn_counter">0</span></td>
          </tr>
        </tbody>
        <tbody id="tbody_population">
        </tbody>
      </table>
    </div>
  </div>
</div>

<div id="canvas_wrapper">
  <canvas id="canvas_history" width="750" height="100"></canvas>
  <canvas id="canvas_main" width="750" height="750"></canvas>
</div>

<?php foot() ; ?>
