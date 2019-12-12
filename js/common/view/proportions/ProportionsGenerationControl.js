// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsGenerationControl is used to choose the generation number displayed in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const generationValueString = require( 'string!NATURAL_SELECTION/generationValue' );

  class ProportionsGenerationControl extends HBox {

    /**
     * @param {Property.<number>} generationProperty
     * @param {Object} [options]
     */
    constructor( generationProperty, options ) {

      options = merge( {
        spacing: 10,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // Previous button, decrements the generation number
      const previousButton = new ArrowButton( 'left',
        () => generationProperty.value--,
        merge( {
          tandem: options.tandem.createTandem( 'previousButton' )
        }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
      );

      // Next button, increments the generation number
      const nextButton = new ArrowButton( 'right',
        () => generationProperty.value++,
        merge( {
          tandem: options.tandem.createTandem( 'nextButton' )
        }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
      );

      // Generation number display
      const generationDisplay = new NumberDisplay( generationProperty, new Range( 0, 99 ), {
        align: 'center',
        valuePattern: generationValueString,
        font: NaturalSelectionConstants.PROPORTIONS_GENERATION_CONTROL_FONT,
        xMargin: 0,
        yMargin: 0,
        backgroundFill: null,
        backgroundStroke: null,
        maxWidth: 150 // determined empirically
      } );

      assert && assert( !options.children, 'ProportionsGenerationControl sets children' );
      options.children = [ previousButton, generationDisplay, nextButton ];

      super( options );

      // Enable buttons
      generationProperty.link( generation => {
        previousButton.enabled = ( generation > 0 );
        //TODO nextButton.enabled = ?
      } );
    }
  }

  return naturalSelection.register( 'ProportionsGenerationControl', ProportionsGenerationControl );
} );