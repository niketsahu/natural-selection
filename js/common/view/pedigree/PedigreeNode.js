// Copyright 2019, University of Colorado Boulder

/**
 * PedigreeNode is the parent for all parts of the 'Pedigree' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AllelesPanel = require( 'NATURAL_SELECTION/common/view/pedigree/AllelesPanel' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionQueryParameters = require( 'NATURAL_SELECTION/common/NaturalSelectionQueryParameters' );
  const PedigreeGraphNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeGraphNode' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PedigreeNode extends HBox {

    /**
     * @param {PedigreeModel} pedigreeModel
     * param {Dimension2} size - dimensions of the rectangle available for this Node and its children
     * @param {Object} [options]
     */
    constructor( pedigreeModel, size, options ) {

      options = merge( {

        // HBox options
        spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        align: 'center',

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // Divy up the width
      // If ?allelesVisible=false, the control panel is omitted, and the graph fills the width.
      const controlPanelWidth = 0.2 * size.width;
      const graphWidth = NaturalSelectionQueryParameters.allelesVisible ?
                         size.width - controlPanelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING :
                         size.width;

      // Because it's instrumented for PhET-iO, the AllelesPanel must be instantiated regardless of the value
      // of ?allelesVisible. If ?allelesVisible=false, it will not be added to the scenegraph, but will
      // still appear in the Studio element tree.
      const allelesPanel = new AllelesPanel( pedigreeModel, {
        fixedWidth: controlPanelWidth,
        maxHeight: size.height,
        tandem: options.tandem.createTandem( 'allelesPanel' )
      } );

      const graphNode = new PedigreeGraphNode( pedigreeModel, {
        graphWidth: graphWidth,
        graphHeight: size.height,
        tandem: options.tandem.createTandem( 'graphNode' )
      } );

      assert && assert( !options.children, 'PedigreeNode sets children' );
      options.children = NaturalSelectionQueryParameters.allelesVisible ?
        [ allelesPanel, graphNode ] :
        [ graphNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PedigreeNode', PedigreeNode );
} );