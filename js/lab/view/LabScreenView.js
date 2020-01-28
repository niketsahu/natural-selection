// Copyright 2019-2020, University of Colorado Boulder

/**
 * LabView is the view for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LabModel = require( 'NATURAL_SELECTION/lab/model/LabModel' );
  const LabViewProperties = require( 'NATURAL_SELECTION/lab/view/LabViewProperties' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionScreenView = require( 'NATURAL_SELECTION/common/view/NaturalSelectionScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );

  class LabScreenView extends NaturalSelectionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof LabModel, 'invalid model' );
      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      const viewProperties = new LabViewProperties( tandem.createTandem( 'viewProperties') );

      super( model, viewProperties, {

        // phet-io
        tandem: tandem
      } );

      //TODO

      // @private
      this.viewProperties = viewProperties;
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'LabScreenView does not support dispose' );
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      super.step( dt );
      //TODO
    }
  }

  return naturalSelection.register( 'LabScreenView', LabScreenView );
} );