// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionColors defines colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import naturalSelection from '../naturalSelection.js';

const SCREEN_VIEW_BACKGROUND = new Color( 229, 225, 204 );

// Panel-like things are stroked with a darker version of SCREEN_VIEW_BACKGROUND. This provides a clear, but
// subtle, border around the panels, and avoids the rectangles-inside-of-rectangles look that is typical of
// the default 'black' stroke.
const PANEL_STROKE = SCREEN_VIEW_BACKGROUND.darkerColor( 0.7 );

const NaturalSelectionColors = {

  // Genes
  FUR: 'rgb( 27, 158, 119 )',
  EARS: 'rgb( 217, 95, 2 )',
  TEETH: 'rgb( 117, 112, 179 )',

  // ScreenViews
  SCREEN_VIEW_BACKGROUND: SCREEN_VIEW_BACKGROUND,

  // Panels
  PANEL_FILL: 'white',
  PANEL_STROKE: PANEL_STROKE,
  SEPARATOR_STROKE: 'rgb( 200, 200, 200 )',

  // Push Buttons
  ADD_A_MATE_BUTTON: PhetColorScheme.BUTTON_YELLOW,
  ADD_MUTATION_BUTTONS: 'rgb( 203, 203, 203 )',
  ARROW_BUTTONS: 'white',
  ZOOM_BUTTONS: 'white',

  // Radio Buttons
  RADIO_BUTTON_SELECTED_STROKE: PhetColorScheme.BUTTON_YELLOW,
  RADIO_BUTTON_DESELECTED_STROKE: 'rgb( 50, 50, 50 )',
  EQUATOR_BUTTON_FILL: 'rgb( 207, 125, 66 )',
  ARCTIC_BUTTON_FILL: 'rgb( 54, 137, 239 )',

  // Graphs
  TOTAL_POPULATION: 'black',
  POPULATION_GRAPH_FILL: 'white',
  PROPORTIONS_GRAPH_FILL: 'white',
  PEDIGREE_GRAPH_FILL: 'rgb( 207, 221, 228 )',
  GRID_LINES_STROKE: 'rgb( 225, 225, 225 )',
  TICK_MARKS_STROKE: 'black',

  // Generation Clock
  CLOCK_FILL: 'rgb( 203, 120, 162 )', // pink
  CLOCK_STROKE: 'black',
  CLOCK_REVEAL_COLOR: 'rgba( 255, 255, 255, 0.6 )', // transparent white
  CLOCK_FOOD_SLICE_COLOR: '#93c83d', // green
  CLOCK_WOLVES_SLICE_COLOR: 'rgb( 102, 102, 102 )' // grey
};

naturalSelection.register( 'NaturalSelectionColors', NaturalSelectionColors );
export default NaturalSelectionColors;