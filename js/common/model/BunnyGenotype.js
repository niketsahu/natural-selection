// Copyright 2019, University of Colorado Boulder

/**
 * BunnyGenotype is the complete set of genes for a bunny.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EarsGenePair = require( 'NATURAL_SELECTION/common/model/EarsGenePair' );
  const FurGenePair = require( 'NATURAL_SELECTION/common/model/FurGenePair' );
  const LongTeethAllele = require( 'NATURAL_SELECTION/common/model/LongTeethAllele' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const TallEarsAllele = require( 'NATURAL_SELECTION/common/model/TallEarsAllele' );
  const TeethGenePair = require( 'NATURAL_SELECTION/common/model/TeethGenePair' );
  const WhiteFurAllele = require( 'NATURAL_SELECTION/common/model/WhiteFurAllele' );

  class BunnyGenotype {

    /**
     * @param {FurGenePair} furGenePair
     * @param {EarsGenePair} earsGenePair
     * @param {TeethGenePair} teethGenePair
     */
    constructor( furGenePair, earsGenePair, teethGenePair ) {
      assert && assert( furGenePair instanceof FurGenePair, 'invalid furGenePair' );
      assert && assert( earsGenePair instanceof EarsGenePair, 'invalid earsGenePair' );
      assert && assert( teethGenePair instanceof TeethGenePair, 'invalid teethGenePair' );

      // @public (read-only)
      this.furGenePair = furGenePair;
      this.earsGenePair = earsGenePair;
      this.teethGenePair = teethGenePair;
    }

    /**
     * Creates the default genotype for a bunny.
     * This genotype is used for the bunnies that have no ancestors, the long bunny and its mate.
     * @returns {BunnyGenotype}
     * @public
     */
    static createDefault() {

      const furGenePair = new FurGenePair( new WhiteFurAllele(), new WhiteFurAllele() );
      const earsGenePair = new EarsGenePair( new TallEarsAllele(), new TallEarsAllele() );
      const teethGenePair = new TeethGenePair( new LongTeethAllele(), new LongTeethAllele() );

      return new BunnyGenotype( furGenePair, earsGenePair, teethGenePair );
    }
  }

  return naturalSelection.register( 'BunnyGenotype', BunnyGenotype );
} );