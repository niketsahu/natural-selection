// Copyright 2020, University of Colorado Boulder

/**
 * BunnyImageCache is a cache of Image nodes for all possible Bunny phenotypes (appearances).
 * These Image instances are used throughout the sim via scenery's DAG feature, so exercise
 * caution when applying transforms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import bunnyBrownFurFloppyEarsLongTeethImage from '../../../images/bunny-brownFur-floppyEars-longTeeth_png.js';
import bunnyBrownFurFloppyEarsShortTeethImage from '../../../images/bunny-brownFur-floppyEars-shortTeeth_png.js';
import bunnyBrownFurStraightEarsLongTeethImage from '../../../images/bunny-brownFur-straightEars-longTeeth_png.js';
import bunnyBrownFurStraightEarsShortTeethImage from '../../../images/bunny-brownFur-straightEars-shortTeeth_png.js';
import bunnyWhiteFurFloppyEarsLongTeethImage from '../../../images/bunny-whiteFur-floppyEars-longTeeth_png.js';
import bunnyWhiteFurFloppyEarsShortTeethImage from '../../../images/bunny-whiteFur-floppyEars-shortTeeth_png.js';
import bunnyWhiteFurStraightEarsLongTeethImage from '../../../images/bunny-whiteFur-straightEars-longTeeth_png.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';

// The cache is a map, which maps phenotype key to an Image instance.
// The phenotype key pattern is '{{hasWhiteFur}}-{{hasStraightEars}}-{{hasShortTeeth}}', where each value is a boolean.
// See getImage for how the key is assembled.
const CACHE = {
  'true-true-true': new Image( bunnyWhiteFurStraightEarsShortTeethImage ),
  'true-true-false': new Image( bunnyWhiteFurStraightEarsLongTeethImage ),
  'true-false-true': new Image( bunnyWhiteFurFloppyEarsShortTeethImage ),
  'true-false-false': new Image( bunnyWhiteFurFloppyEarsLongTeethImage ),
  'false-true-true': new Image( bunnyBrownFurStraightEarsShortTeethImage ),
  'false-true-false': new Image( bunnyBrownFurStraightEarsLongTeethImage ),
  'false-false-true': new Image( bunnyBrownFurFloppyEarsShortTeethImage ),
  'false-false-false': new Image( bunnyBrownFurFloppyEarsLongTeethImage )
};
assert && assert( _.keys( CACHE ).length === 8, 'CACHE is incomplete' );
assert && assert( _.every( _.keys( CACHE ), key => key.match( /(true|false)-(true|false)-(true|false)/ ) ),
  'CACHE has an invalid key' );

const BunnyImageCache = {

  /**
   * Gets the cached Image that matches a bunny's phenotype. Instead of a big if-then-else statement for each
   * permutation of traits, this implementation converts the phenotype to a string key, and maps that key to an Image.
   *
   * @param {Bunny} bunny
   * @returns {HTMLImageElement}
   * @public
   */
  getImage( bunny ) {

    // create the key by inspecting the phenotype
    const key = `${bunny.phenotype.hasWhiteFur()}-${bunny.phenotype.hasStraightEars()}-${bunny.phenotype.hasShortTeeth()}`;

    // look up the image in the map
    return CACHE[ key ];
  },

  /**
   * Similar to getImage, but a convenience method that wraps the cached bunny Image in a Node.
   * Use this method if you need to transform the image.
   *
   * @param {Bunny} bunny
   * @param {Object} [options] - applied to Node wrapper
   * @returns {Node}
   */
  getWrappedImage( bunny, options ) {

    assert( !options || !options.children, 'getWrappedImage sets children' );

    options = merge( {
      children: [ BunnyImageCache.getImage( bunny ) ]
    }, options );

    return new Node( options );
  }
};

naturalSelection.register( 'BunnyImage', BunnyImageCache );
export default BunnyImageCache;