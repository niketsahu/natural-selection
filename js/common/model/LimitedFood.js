// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentalFactor = require( 'NATURAL_SELECTION/common/model/EnvironmentalFactor' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class LimitedFood extends EnvironmentalFactor {

    constructor() {
      super();
    }
  }

  return naturalSelection.register( 'LimitedFood', LimitedFood );
} );