// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import HomeScreenView from '../../../joist/js/HomeScreenView.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import RectangularButtonView from '../../../sun/js/buttons/RectangularButtonView.js';
import naturalSelection from '../naturalSelection.js';
import NaturalSelectionColors from './NaturalSelectionColors.js';
import NaturalSelectionQueryParameters from './NaturalSelectionQueryParameters.js';

// constants
const CORNER_RADIUS = 5;

const NaturalSelectionConstants = {

  // Model ===========================================================================================================

  // number of bunnies required to 'take over the world'
  MAX_POPULATION: NaturalSelectionQueryParameters.maxPopulation,

  // bunnies die when they reach this age, in generations
  MAX_AGE: NaturalSelectionQueryParameters.maxAge,

  // number of offspring produced each time a pair of bunnies mates
  LITTER_SIZE: 4,

  // time to complete 1 revolution of the generation clock, in seconds
  SECONDS_PER_GENERATION: NaturalSelectionQueryParameters.secondsPerGeneration,

  // Generation Clock
  CLOCK_FOOD_RANGE: new Range( 1/6, 3/6 ), // percentage of clock cycle when bunnies are starved by food factors
  CLOCK_WOLVES_RANGE: new Range( 3/6, 5/6 ), // percentage of clock cycle when bunnies are eaten by wolves

  // View ============================================================================================================N

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15, // margins at left and right edges of the ScreenView
  SCREEN_VIEW_Y_MARGIN: 15, // margins at top and bottom edges of the ScreenView
  SCREEN_VIEW_X_SPACING: 10, // horizontal spacing between UI components in the ScreenView
  SCREEN_VIEW_Y_SPACING: 10, // vertical spacing between UI components in the ScreenView

  // EnvironmentNode
  ENVIRONMENT_DISPLAY_X_MARGIN: 15, // margins at left and right edges of the viewport
  ENVIRONMENT_DISPLAY_Y_MARGIN: 15, // margins at top and bottom edges of the viewport

  CORNER_RADIUS: CORNER_RADIUS,

  // ArrowButton
  ARROW_BUTTON_OPTIONS: {
    baseColor: NaturalSelectionColors.ARROW_BUTTONS,
    stroke: 'black',
    buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
    cornerRadius: 2,
    lineWidth: 0.5,
    arrowWidth: 8, // width of base
    arrowHeight: 10, // from tip to base
    xMargin: 6,
    yMargin: 4
  },

  // Checkbox
  CHECKBOX_OPTIONS: {
    spacing: 4,
    boxWidth: 16
  },
  CHECKBOX_X_SPACING: 6,

  // Panel
  PANEL_OPTIONS: {
    align: 'left',
    cornerRadius: CORNER_RADIUS,
    xMargin: 15,
    yMargin: 10,
    fill: NaturalSelectionColors.PANEL_FILL,
    stroke: NaturalSelectionColors.PANEL_STROKE
  },

  // RectangularPushButton
  RECTANGULAR_PUSH_BUTTON_OPTIONS: {
    cornerRadius: CORNER_RADIUS
  },

  // VBox
  VBOX_OPTIONS: {
    spacing: 11,
    align: 'left'
  },

  // Dialog
  //TODO workaround for https://github.com/phetsims/joist/issues/586
  DIALOG_SCALE: HomeScreenView.LAYOUT_BOUNDS.width / ScreenView.DEFAULT_LAYOUT_BOUNDS.width,

  // Fonts
  CHECKBOX_FONT: new PhetFont( 16 ),
  PUSH_BUTTON_FONT: new PhetFont( 16 ),
  RADIO_BUTTON_FONT: new PhetFont( 16 ),
  INSTRUCTIONS_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  ADD_MUTATION_GENE_FONT: new PhetFont( 16 ),
  ADD_MUTATION_COLUMN_HEADING_FONT: new PhetFont( 14 ),
  MUTATION_COMING_FONT: new PhetFont( 16 ),
  POPULATION_AXIS_FONT: new PhetFont( 14 ),
  PROPORTIONS_GENERATION_CONTROL_FONT: new PhetFont( 16 ),
  PROPORTIONS_LEGEND_FONT: new PhetFont( 16 ),
  DIALOG_FONT: new PhetFont( 16 ),

  // Population plot
  POPULATION_POINT_RADIUS: 2.4, // point radius, in view coordinates
  POPULATION_MUTANT_LINE_DASH: [ 3, 2 ]
};

assert && assert( NaturalSelectionConstants.LITTER_SIZE === 4,
  'LITTER_SIZE must be 4, to correspond to the Punnett square that results from Mendel\'s Law of Segregation' );

assert && AssertUtils.assertRangeBetween( NaturalSelectionConstants.CLOCK_FOOD_RANGE, 0, 1 );
assert && AssertUtils.assertRangeBetween( NaturalSelectionConstants.CLOCK_WOLVES_RANGE, 0, 1 );

naturalSelection.register( 'NaturalSelectionConstants', NaturalSelectionConstants );
export default NaturalSelectionConstants;