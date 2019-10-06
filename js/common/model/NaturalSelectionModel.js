// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Climates = require( 'NATURAL_SELECTION/common/model/Climates' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class NaturalSelectionModel {

    constructor() {

      // @public the climate where the simulation is taking place
      this.climateProperty = new EnumerationProperty( Climates, Climates.EQUATOR );
    }

    /**
     * @public
     */
    reset() {
      this.climateProperty.reset();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     * @override
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
} );