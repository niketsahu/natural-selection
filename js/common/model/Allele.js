// Copyright 2020, University of Colorado Boulder

/**
 * Allele is a variant form of a gene.  In this sim, the language used to name an allele (a gene variant) and
 * a phenotype (expression of that gene) are synonymous. For example, 'White Fur' is used to describe both the
 * allele and the phenotype. Note that gene and allele are often used interchangeably in the literature,
 * but we attempt to use them consistently in this implementation.
 *
 * There is one instance of each Allele, and they are global to the simulation. They are defined herein as
 * static instances, and appear in Studio as children of the element 'naturalSelection.global.model.alleles'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import brownFurImage from '../../../images/brownFur_png.js';
import floppyEarsImage from '../../../images/floppyEars_png.js';
import longTeethImage from '../../../images/longTeeth_png.js';
import shortTeethImage from '../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../images/straightEars_png.js';
import whiteFurImage from '../../../images/whiteFur_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';

class Allele extends PhetioObject {

  /**
   * @param {string} name - name of the allele
   * @param {HTMLImageElement} image - image used to represent the allele in the UI
   * @param {string} tandemPrefix - prefix used for tandem names for the allele, like 'whiteFur' for 'whiteFurCheckbox'
   * @param {Object} [options]
   */
  constructor( name, image, tandemPrefix, options ) {

    assert && assert( typeof name === 'string', 'invalid name' );
    assert && assert( image instanceof HTMLImageElement, 'invalid image' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Allele.AlleleIO
    }, options );

    assert && assert( options.tandem.name.startsWith( tandemPrefix ),
      `tandem name ${options.tandem.name} must start with ${tandemPrefix}` );

    super( options );

    // @public (read-only)
    this.name = name;
    this.image = image;
    this.tandemPrefix = tandemPrefix;
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

/**
 * AlleleIO handles PhET-iO serialization of Allele. It implements 'Reference type serialization',
 * as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-guide.md#serialization
 * @public
 */
Allele.AlleleIO = new IOType( 'AlleleIO', {
  valueType: Allele,
  supertype: ReferenceIO( IOType.ObjectIO )
} );

// Static instances

// tandem for all static instances of Solute, which are used across all screens
const ALLELES_TANDEM = Tandem.GLOBAL.createTandem( 'model' ).createTandem( 'alleles' );

Allele.WHITE_FUR = new Allele( naturalSelectionStrings.whiteFur, whiteFurImage, 'whiteFur', {
  tandem: ALLELES_TANDEM.createTandem( 'whiteFurAllele' )
} );

Allele.BROWN_FUR = new Allele( naturalSelectionStrings.brownFur, brownFurImage, 'brownFur', {
  tandem: ALLELES_TANDEM.createTandem( 'brownFurAllele' )
} );

Allele.FLOPPY_EARS = new Allele( naturalSelectionStrings.floppyEars, floppyEarsImage, 'floppyEars', {
  tandem: ALLELES_TANDEM.createTandem( 'floppyEarsAllele' )
} );

Allele.STRAIGHT_EARS = new Allele( naturalSelectionStrings.straightEars, straightEarsImage, 'straightEars', {
  tandem: ALLELES_TANDEM.createTandem( 'straightEarsAllele' )
} );

Allele.SHORT_TEETH = new Allele( naturalSelectionStrings.shortTeeth, shortTeethImage, 'shortTeeth', {
  tandem: ALLELES_TANDEM.createTandem( 'shortTeethAllele' )
} );

Allele.LONG_TEETH = new Allele( naturalSelectionStrings.longTeeth, longTeethImage, 'longTeeth', {
  tandem: ALLELES_TANDEM.createTandem( 'longTeethAllele' )
} );

naturalSelection.register( 'Allele', Allele );
export default Allele;