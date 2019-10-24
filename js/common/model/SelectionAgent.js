// Copyright 2019, University of Colorado Boulder

/**
 * SelectionAgent is the base class for all selection agents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class SelectionAgent {

    constructor() {

      // @public
      this.enabledProperty = new BooleanProperty( false );
    }

    /**
     * @public
     */
    reset() {
      this.enabledProperty.reset();
    }
  }

  return naturalSelection.register( 'SelectionAgent', SelectionAgent );
} );