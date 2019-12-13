// Copyright 2019, University of Colorado Boulder

/**
 * EnvironmentDisplayNode is our viewport into the world of bunnies.
 * This class was named by committee, see https://github.com/phetsims/natural-selection/issues/27
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const EnvironmentBackgroundNode = require( 'NATURAL_SELECTION/common/view/EnvironmentBackgroundNode' );
  const EnvironmentRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/EnvironmentRadioButtonGroup' );
  const GenerationClockNode = require( 'NATURAL_SELECTION/common/view/GenerationClockNode' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayAgainButton = require( 'NATURAL_SELECTION/common/view/PlayAgainButton' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );

  class EnvironmentDisplayNode extends Node {

    /**
     * @param {NaturalSelectionModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = merge( {
        viewportSize: NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_SIZE,
        viewportHorizonY: NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_HORIZON_Y,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const backgroundNode = new EnvironmentBackgroundNode( model.environmentModel.environmentProperty,
        options.viewportSize, options.viewportHorizonY );

      // Everything in the world, clipped to the viewport
      const worldContents = new Node( {
        children: [ backgroundNode ],
        clipArea: Shape.rect( 0, 0, options.viewportSize.width, options.viewportSize.height )
      } );

      // Frame around the viewport, to provide a nice crisp border, and for layout of UI components.
      const frameNode = new Rectangle( 0, 0, options.viewportSize.width, options.viewportSize.height, {
        stroke: NaturalSelectionColors.PANEL_STROKE
      } );

      // Generation clock
      const generationClockNode = new GenerationClockNode( model.generationClock,
        model.environmentModel.environmentalFactorEnabledProperty, {
          centerX: frameNode.centerX,
          top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_Y_MARGIN,
          tandem: options.tandem.createTandem( 'generationClockNode' )
        } );

      // Environment radio buttons
      const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( model.environmentModel.environmentProperty, {
        right: frameNode.right - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_X_MARGIN,
        top: frameNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_Y_MARGIN,
        tandem: options.tandem.createTandem( 'environmentRadioButtonGroup' )
      } );

      // 'Add a Mate' push button
      const addAMateButton = new AddAMateButton( {
        listener: () => {
          model.mateWasAddedProperty.value = true;
          addAMateButton.visible = false;
          //TODO
        },
        centerX: frameNode.centerX,
        bottom: frameNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_NODE_Y_MARGIN,
        tandem: options.tandem.createTandem( 'addAMateButton' )
      } );

      // 'Play Again' push button
      const playAgainButton = new PlayAgainButton( {
        center: frameNode.center,
        // visible: false, //TODO
        listener: () => {
          //TODO
        },
        tandem: options.tandem.createTandem( 'playAgainButton' )
      } );

      // layering
      assert && assert( !options.children, 'EnvironmentDisplayNode sets children' );
      options.children = [
        worldContents,
        frameNode,
        generationClockNode,
        environmentRadioButtonGroup,
        addAMateButton,
        playAgainButton
      ];

      super( options );

      // @private
      this.resetEnvironmentDisplayNode = () => {
        addAMateButton.visible = true;
      };
    }

    /**
     * @public
     */
    reset() {
      this.resetEnvironmentDisplayNode();
    }
  }

  return naturalSelection.register( 'EnvironmentDisplayNode', EnvironmentDisplayNode );
} );