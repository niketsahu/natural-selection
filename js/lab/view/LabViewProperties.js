// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabViewProperties contains view-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionViewProperties = require( 'NATURAL_SELECTION/common/view/NaturalSelectionViewProperties' );
  const Tandem = require( 'TANDEM/Tandem' );

  class LabViewProperties extends NaturalSelectionViewProperties {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      super( tandem );
      //TODO
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      //TODO
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'LabViewProperties does not support dispose' );
    }
  }

  return naturalSelection.register( 'LabViewProperties', LabViewProperties );
} );