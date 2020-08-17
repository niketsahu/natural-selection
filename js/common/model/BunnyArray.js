// Copyright 2020, University of Colorado Boulder

/**
 * BunnyArray is an AxonArray of Bunny instances, with counts for each phenotype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxonArray from '../../../../axon/js/AxonArray.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';
import BunnyIO from './BunnyIO.js';

class BunnyArray extends AxonArray {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // Support construction via Array.prototype.splice.apply(), etc., which invoke the sub-constructor
    if ( typeof options === 'number' ) {
      super( options );
      return;
    }

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioElementType: ReferenceIO( BunnyIO ),
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.countsProperty = new Property( BunnyCounts.withZero(), {
      tandem: options.tandem.createTandem( 'countsProperty' ),
      phetioType: PropertyIO( BunnyCountsIO ),
      phetioState: false // because counts will be restored as Bunny instances are restored to BunnyGroup
    } );

    // Update counts when a bunny is added.
    this.elementAddedEmitter.addListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.plus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );

    // Update counts when a bunny is removed.
    this.elementRemovedEmitter.addListener( bunny => {
      this.countsProperty.value = this.countsProperty.value.minus( bunny );
      assert && assert( this.countsProperty.value.totalCount === this.length, 'counts out of sync' );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'BunnyArray', BunnyArray );
export default BunnyArray;