// Copyright 2020, University of Colorado Boulder

/**
 * BunnyCollection is the collection of Bunny instances, with methods for managing that collection.
 * It encapsulates BunnyGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Range from '../../../../dot/js/Range.js';
import RangeIO from '../../../../dot/js/RangeIO.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import Allele from './Allele.js';
import Bunny from './Bunny.js';
import BunnyArray from './BunnyArray.js';
import BunnyArrayIO from './BunnyArrayIO.js';
import BunnyGroup from './BunnyGroup.js';
import CauseOfDeath from './CauseOfDeath.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';
import PunnettSquare from './PunnettSquare.js';
import SelectedBunnyProperty from './SelectedBunnyProperty.js';

// constants

// Ranges for bunny rest time, as specified in https://github.com/phetsims/natural-selection/issues/129
const BUNNY_REST_RANGE_SHORT = new Range( 2, 4 );
const BUNNY_REST_RANGE_MEDIUM = new Range( 3, 7 );
const BUNNY_REST_RANGE_LONG = new Range( 5, 9 );

// The maximum number of generations that a dead bunny needs to exist before it can be disposed.
// This is based on the Pedigree graph depth, because the Pedigree graph is the only place where
// dead bunnies appear. See https://github.com/phetsims/natural-selection/issues/112
const MAX_DEAD_BUNNY_GENERATIONS = NaturalSelectionQueryParameters.maxAge *
                                   ( NaturalSelectionConstants.PEDIGREE_TREE_DEPTH - 1 );

class BunnyCollection {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( modelViewTransform, genePool, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only) the live bunnies in bunnyGroup
    this.liveBunnies = new BunnyArray( {
      tandem: options.tandem.createTandem( 'liveBunnies' )
    } );

    // @public (read-only) the dead bunnies in bunnyGroup
    this.deadBunnies = new BunnyArray( {
      tandem: options.tandem.createTandem( 'deadBunnies' ),
      phetioType: BunnyArrayIO
    } );

    // @private {Bunny[]} Recessive mutants, to be mated eagerly so that their mutation appears in the phenotype as
    // soon as possible. Mutants are added to this array when born, and removed as soon as they have mated with
    // another bunny that has the mutation.
    this.recessiveMutants = new BunnyArray( {
      tandem: options.tandem.createTandem( 'recessiveMutants' ),
      phetioDocumentation: 'for internal PhET use only'
    } );

    // @private {Property.<Range>} the range of time that a bunny will reset between hops, in seconds.
    // This value is derived from population size, so that bunnies rest longer when the population is larger.
    // Range values and populations sizes are specified in https://github.com/phetsims/natural-selection/issues/129
    //TODO this is called every time a bunny is born or dies, is there a performance impact?
    this.bunnyRestRangeProperty = new DerivedProperty(
      [ this.liveBunnies.lengthProperty ],
      length => {
        if ( length < 10 ) {
          return BUNNY_REST_RANGE_SHORT;
        }
        else if ( length < 250 ) {
          return BUNNY_REST_RANGE_MEDIUM;
        }
        else {
          return BUNNY_REST_RANGE_LONG;
        }
      }, {
        tandem: options.tandem.createTandem( 'bunnyRestRangeProperty' ),
        phetioType: DerivedPropertyIO( RangeIO ),
        phetioDocumentation: 'for internal PhET use only'
      } );
    phet.log && this.bunnyRestRangeProperty.link( bunnyRestRange => {
      phet.log && phet.log( `using bunnyRestRange=[${bunnyRestRange.min},${bunnyRestRange.max}] ` +
                            `for population=${this.liveBunnies.lengthProperty.value}` );
    } );

    // the PhetioGroup that manages Bunny instances as dynamic PhET-iO elements
    const bunnyGroup = new BunnyGroup( genePool, modelViewTransform, this.bunnyRestRangeProperty, {
      tandem: options.tandem.createTandem( 'bunnyGroup' )
    } );

    // @public
    this.selectedBunnyProperty = new SelectedBunnyProperty( {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' )
    } );
    // unlink is not necessary.
    phet.log && this.selectedBunnyProperty.link( selectedBunny => {
      phet.log && phet.log( `selectedBunny=${selectedBunny}` );
    } );

    // @public notify when a bunny has been created
    this.bunnyCreatedEmitter = new Emitter( {
      parameters: [ { valueType: Bunny } ]
    } );

    // NOTE: BunnyCollection has no bunnyDiedEmitter or bunnyDisposedEmitter. Bunny has those Emitters.

    // @public notifies when all bunnies have died. dispose is not necessary.
    this.allBunniesHaveDiedEmitter = new Emitter();
    phet.log && this.allBunniesHaveDiedEmitter.addListener( () => {
      phet.log && phet.log( 'All of the bunnies have died.' );
      phet.log && phet.log( `total live bunnies = ${this.liveBunnies.length}` );
      phet.log && phet.log( `total dead bunnies = ${this.deadBunnies.length}` );
    } );

    // @public notifies when bunnies have taken over the world. dispose is not necessary.
    this.bunniesHaveTakenOverTheWorldEmitter = new Emitter();
    phet.log && this.bunniesHaveTakenOverTheWorldEmitter.addListener( () => {
      phet.log && phet.log( 'Bunnies have taken over the world.' );
      phet.log && phet.log( `total live bunnies = ${this.liveBunnies.length}` );
      phet.log && phet.log( `total dead bunnies = ${this.deadBunnies.length}` );
    } );

    // When a bunny is created or restored via PhET-iO. removeListener is not necessary.
    bunnyGroup.elementCreatedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );

      if ( bunny.isAlive ) {

        // When the bunny dies, clean up.
        // removeListener is not necessary because Bunny.diedEmitter is disposed after firing.
        bunny.diedEmitter.addListener( () => {
          this.liveBunnies.remove( bunny );
          this.deadBunnies.push( bunny );
          this.recessiveMutants.includes( bunny ) && this.recessiveMutants.remove( bunny );
          if ( this.liveBunnies.length === 0 ) {
            this.allBunniesHaveDiedEmitter.emit();
          }
        } );

        this.liveBunnies.push( bunny );
      }
      else {
        assert && assert( phet.joist.sim.isSettingPhetioStateProperty.value,
          'a dead bunny should only be created when restoring PhET-iO state' );
        this.deadBunnies.push( bunny );
      }

      this.bunnyCreatedEmitter.emit( bunny );
    } );

    // When a bunny is disposed, remove it from the appropriate array. removeListener is not necessary.
    bunnyGroup.elementDisposedEmitter.addListener( bunny => {
      assert && assert( bunny instanceof Bunny, 'invalid bunny' );
      this.liveBunnies.includes( bunny ) && this.liveBunnies.remove( bunny );
      this.deadBunnies.includes( bunny ) && this.deadBunnies.remove( bunny );
      this.recessiveMutants.includes( bunny ) && this.recessiveMutants.remove( bunny );
    } );

    // @private fields needed by methods
    this.genePool = genePool;
    this.bunnyGroup = bunnyGroup;
  }

  /**
   * Resets the group.
   * @public
   */
  reset() {
    this.bunnyGroup.clear(); // calls dispose for all Bunny instances
    this.selectedBunnyProperty.reset();
    assert && this.assertValidCounts();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Gets the archetype for the PhetioGroup.
   * @returns {Bunny|null} non-null only during API harvest
   * @public
   */
  getArchetype() {
    return this.bunnyGroup.archetype;
  }

  /**
   * Creates a Bunny.
   * @param {Object} [options] - options to Bunny constructor
   * @returns {Bunny}
   * @public
   */
  createBunny( options ) {
    return this.bunnyGroup.createNextElement( options );
  }

  /**
   * Creates a generation-zero Bunny.
   * @returns {Bunny}
   * @param {Object} [options]
   * @public
   */
  createBunnyZero( options ) {

    if ( options ) {
      assert && assert( !options.father, 'createBunnyZero sets father' );
      assert && assert( !options.mother, 'createBunnyZero sets mother' );
      assert && assert( options.generation === undefined, 'createBunnyZero sets generation' );
    }

    options = merge( {
      father: null,
      mother: null,
      generation: 0
    }, options );

    this.createBunny( options );
  }

  /**
   * Moves all live bunnies.
   * @param {number} dt - time step, in seconds
   * @public
   */
  moveBunnies( dt ) {
    assert && assert( typeof dt === 'number' && dt >= 0, `invalid dt: ${dt}` );
    this.liveBunnies.forEach( bunny => bunny.move( dt ) );
  }

  /**
   * Ages all live bunnies. Bunnies that reach their maximum age will die.
   * @public
   */
  ageBunnies() {
    assert && assert( _.every( this.liveBunnies.getArray(), bunny => bunny.isAlive ),
      'liveBunnies contains one or more dead bunnies' );

    let diedCount = 0;

    // liveBunnies will change if any bunnies die, so operate on a copy
    const bunnies = this.liveBunnies.getArrayCopy();
    bunnies.forEach( bunny => {

      // bunny is one generation older
      bunny.age++;
      assert && assert( bunny.age <= NaturalSelectionConstants.MAX_AGE,
        `${bunny.tandem.name} age=${bunny.age} exceeds maxAge=${NaturalSelectionConstants.MAX_AGE}` );

      // bunny dies if it exceeds the maximum age
      if ( bunny.age === NaturalSelectionConstants.MAX_AGE ) {
        bunny.die( CauseOfDeath.OLD_AGE );
        diedCount++;
      }
    } );

    assert && this.assertValidCounts();
    phet.log && phet.log( `${diedCount} bunnies died of old age` );
  }

  /**
   * Mates all live bunnies by randomly pairing them up. Any bunny can mate with any other bunny, regardless of their
   * age or previous hereditary relationship. If there is an odd number of bunnies, then one of them will not mate.
   * Mutations (if any) are applied as the bunnies are born.
   * @param {number} generation
   * @public
   */
  mateBunnies( generation ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( generation ), 'invalid generation' );

    // The number of bunnies born.
    let bornIndex = 0;

    // Shuffle the collection of live bunnies so that mating is random. shuffle returns a new array.
    let bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );

    // Prioritize mating of bunnies that have a recessive mutation, so that the mutation appears in the phenotype
    // as soon as possible. This is referred to as 'mating eagerly'.
    // See https://github.com/phetsims/natural-selection/issues/98.
    if ( this.recessiveMutants.length > 0 ) {
      bunnies = this.mateRecessiveMutants( generation, bunnies );
    }

    // The number of bunnies that we expect to be born.
    const numberToBeBorn = Math.floor( bunnies.length / 2 ) * NaturalSelectionConstants.LITTER_SIZE;

    // Determine which mutations should be applied, then reset the gene pool.
    const mutateFur = this.genePool.furGene.mutationComingProperty.value;
    const mutateEars = this.genePool.earsGene.mutationComingProperty.value;
    const mutateTeeth = this.genePool.teethGene.mutationComingProperty.value;
    this.genePool.resetMutationComing();

    // Indices (values of bornIndex) for the new bunnies that will be mutated.
    // Mutations are mutually exclusive, as are the values in these arrays.
    let furIndices = [];
    let earsIndices = [];
    let teethIndices = [];

    // If a mutation is to be applied...
    if ( mutateFur || mutateEars || mutateTeeth ) {

      // When a mutation is applied, this is the number of bunnies that will receive that mutation.
      const numberToMutate = Math.max( 1, Utils.roundSymmetric( NaturalSelectionQueryParameters.mutationPercentage * numberToBeBorn ) );

      // Create indices of the new bunnies, for the purpose of applying mutations.
      let indices = [];
      for ( let i = 0; i < numberToBeBorn; i++ ) {
        indices.push( i );
      }

      // Randomly shuffle the indices, so that we can just take how many we need from the beginning of the array.
      indices = phet.joist.random.shuffle( indices );

      // Select indices for each mutation that will be applied by taking indices from the beginning of the array.
      if ( mutateFur ) {
        furIndices = indices.splice( 0, numberToMutate );
      }
      if ( mutateEars ) {
        earsIndices = indices.splice( 0, numberToMutate );
      }
      if ( mutateTeeth ) {
        teethIndices = indices.splice( 0, numberToMutate );
      }
    }
    assert && assert( Array.isArray( furIndices ), 'expected an array' );
    assert && assert( Array.isArray( earsIndices ), 'expected an array' );
    assert && assert( Array.isArray( teethIndices ), 'expected an array' );

    // Mate pairs from the collection, applying mutations where appropriate.
    for ( let i = 1; i < bunnies.length; i = i + 2 ) {

      // Mate adjacent bunnies. In this sim, bunnies are sexless, so their sex is irrelevant.
      const father = bunnies[ i ];
      const mother = bunnies[ i - 1 ];

      // Get the Punnett square (genetic cross) for each gene. The order of each cross is random.
      const furPunnetSquare = new PunnettSquare( father.genotype.furGenePair, mother.genotype.furGenePair );
      const earsPunnetSquare = new PunnettSquare( father.genotype.earsGenePair, mother.genotype.earsGenePair );
      const teethPunnetSquare = new PunnettSquare( father.genotype.teethGenePair, mother.genotype.teethGenePair );

      // Create a litter for this bunny pair
      for ( let j = 0; j < NaturalSelectionConstants.LITTER_SIZE; j++ ) {

        // A bunny is born
        const bunny = this.createBunny( {
          father: father,
          mother: mother,
          generation: generation,
          genotypeOptions: {

            // inherited alleles
            fatherFurAllele: furPunnetSquare.getCell( j ).fatherAllele,
            motherFurAllele: furPunnetSquare.getCell( j ).motherAllele,
            fatherEarsAllele: earsPunnetSquare.getCell( j ).fatherAllele,
            motherEarsAllele: earsPunnetSquare.getCell( j ).motherAllele,
            fatherTeethAllele: teethPunnetSquare.getCell( j ).fatherAllele,
            motherTeethAllele: teethPunnetSquare.getCell( j ).motherAllele,

            // mutations
            mutateFur: furIndices.includes( bornIndex ),
            mutateEars: earsIndices.includes( bornIndex ),
            mutateTeeth: teethIndices.includes( bornIndex )
          }
        } );

        bornIndex++;

        // Keep track of recessive mutants, to be 'mated eagerly' when another bunny with the mutation exists.
        if ( bunny.isOriginalMutant() && this.genePool.isRecessiveMutation( bunny.genotype.mutation ) ) {
          phet.log && phet.log( `adding to recessiveMutants: ${bunny}` );
          this.recessiveMutants.push( bunny );
        }
      }
    }

    assert && this.assertValidCounts();
    assert && assert( bornIndex === numberToBeBorn, 'unexpected number of bunnies were born' );
    phet.log && phet.log( `${bornIndex} bunnies were born` );

    // Notify if bunnies have taken over the world.
    if ( this.liveBunnies.lengthProperty.value >= NaturalSelectionConstants.MAX_POPULATION ) {
      this.bunniesHaveTakenOverTheWorldEmitter.emit();
    }
  }

  /**
   * Mates each recessive mutant with a bunny that has the same mutation. This is referred to as 'mate eagerly', as
   * the purpose is to make the mutation appear in the phenotype sooner. This must be done separately from other mating
   * because we don't want to apply additional mutations.
   * @param {number} generation
   * @param {Bunny[]} bunnies - the bunnies that are candidates for mating, modified as a side-effect
   * @returns {Bunny[]} the bunnies array, with bunnies that are successfully mated removed
   * @private
   */
  mateRecessiveMutants( generation, bunnies ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( generation ), 'invalid generation' );
    assert && assert( Array.isArray( bunnies ), 'invalid bunnies' );

    const recessiveMutantsCopy = this.recessiveMutants.getArrayCopy();

    // For each recessive mutant...
    while ( recessiveMutantsCopy.length > 0 ) {

      const fatherIndex = 0;
      const mutantFather = recessiveMutantsCopy[ fatherIndex ];
      recessiveMutantsCopy.splice( fatherIndex, 1 );

      // If we find a mate...
      const mutantMother = getMateForRecessiveMutant( mutantFather, bunnies );
      if ( mutantMother ) {

        // Get the Punnett square (genetic cross) for each gene. The order of each cross is random.
        const furPunnetSquare = new PunnettSquare( mutantFather.genotype.furGenePair, mutantMother.genotype.furGenePair );
        const earsPunnetSquare = new PunnettSquare( mutantFather.genotype.earsGenePair, mutantMother.genotype.earsGenePair );
        const teethPunnetSquare = new PunnettSquare( mutantFather.genotype.teethGenePair, mutantMother.genotype.teethGenePair );

        // Create a litter for this bunny pair
        for ( let i = 0; i < NaturalSelectionConstants.LITTER_SIZE; i++ ) {

          // inherited alleles
          const genotypeOptions = {
            fatherFurAllele: furPunnetSquare.getCell( i ).fatherAllele,
            motherFurAllele: furPunnetSquare.getCell( i ).motherAllele,
            fatherEarsAllele: earsPunnetSquare.getCell( i ).fatherAllele,
            motherEarsAllele: earsPunnetSquare.getCell( i ).motherAllele,
            fatherTeethAllele: teethPunnetSquare.getCell( i ).fatherAllele,
            motherTeethAllele: teethPunnetSquare.getCell( i ).motherAllele
          };

          // A bunny is born
          this.createBunny( {
            father: mutantFather,
            mother: mutantMother,
            generation: generation,
            genotypeOptions: genotypeOptions
          } );
        }

        // Create 1 additional offspring that is homozygous recessive, in order to make the recessive allele
        // propagate through the phenotype more quickly.
        // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
        const mutantAllele = mutantFather.genotype.mutation;
        const furCell = getAdditionalPunnettCell( furPunnetSquare, mutantAllele, this.genePool.furGene.dominantAlleleProperty.value );
        const earsCell = getAdditionalPunnettCell( earsPunnetSquare, mutantAllele, this.genePool.earsGene.dominantAlleleProperty.value );
        const teethCell = getAdditionalPunnettCell( teethPunnetSquare, mutantAllele, this.genePool.teethGene.dominantAlleleProperty.value );
        const genotypeOptions = {
          fatherFurAllele: furCell.fatherAllele,
          motherFurAllele: furCell.motherAllele,
          fatherEarsAllele: earsCell.fatherAllele,
          motherEarsAllele: earsCell.motherAllele,
          fatherTeethAllele: teethCell.fatherAllele,
          motherTeethAllele: teethCell.motherAllele
        };
        this.createBunny( {
          father: mutantFather,
          mother: mutantMother,
          generation: generation,
          genotypeOptions: genotypeOptions
        } );

        // Remove the mutants from further consideration of mating.
        bunnies.splice( bunnies.indexOf( mutantFather ), 1 );
        bunnies.splice( bunnies.indexOf( mutantMother ), 1 );

        // Remove the mutants from further consideration of mating eagerly. Note that the mother may have been a
        // sibling (another original mutant created in the same generation) or a member of a later generation.
        this.recessiveMutants.remove( mutantFather );
        if ( this.recessiveMutants.includes( mutantMother ) ) {
          this.recessiveMutants.remove( mutantMother );
        }
        if ( recessiveMutantsCopy.includes( mutantMother ) ) {
          recessiveMutantsCopy.splice( recessiveMutantsCopy.indexOf( mutantMother ), 1 );
        }
      }
    }

    return bunnies;
  }

  /**
   * Moves all live bunnies to the ground, so that we don't have bunnies paused mid-hop.
   * @public
   */
  moveBunniesToGround() {
    this.liveBunnies.forEach( bunny => bunny.interruptHop() );
  }

  /**
   * Gets the live bunny counts.
   * @returns {BunnyCounts}
   * @public
   */
  getLiveBunnyCounts() {
    return this.liveBunnies.countsProperty.value;
  }

  /**
   * Gets the bunnies that are candidates for natural selection due to environmental factors, in a random order.
   * @returns {Bunny[]}
   * @public
   */
  getSelectionCandidates() {

    // Live bunnies are candidates.
    const bunnies = phet.joist.random.shuffle( this.liveBunnies.getArray() );

    // Recessive mutants are not candidates until they have mated.
    // See https://github.com/phetsims/natural-selection/issues/98#issuecomment-646275437
    for ( let i = 0; i < this.recessiveMutants.length; i++ ) {
      bunnies.splice( bunnies.indexOf( this.recessiveMutants[ i ] ), 1 );
    }

    return bunnies;
  }

  /**
   * Disposes of dead bunnies that are guaranteed not to be needed by the Pedigree graph.
   * See https://github.com/phetsims/natural-selection/issues/112
   * @param {number} currentGeneration
   * @public
   */
  pruneDeadBunnies( currentGeneration ) {
    assert && AssertUtils.assertPositiveInteger( currentGeneration );

    let numberPruned = 0;

    // This modifies the array. Iterate backwards to avoid having to make a copy.
    const deadBunnies = this.deadBunnies.getArray();
    for ( let i = deadBunnies.length - 1; i >= 0; i-- ) {
      const bunny = deadBunnies[ i ];
      if ( currentGeneration - bunny.generation > MAX_DEAD_BUNNY_GENERATIONS &&
           this.selectedBunnyProperty.value !== bunny ) {
        this.bunnyGroup.disposeElement( bunny );
        numberPruned++;
      }
    }

    if ( numberPruned > 0 ) {
      phet.log && phet.log( `${numberPruned} dead bunnies pruned` );
    }
  }

  /**
   * Asserts that collection counts are in-sync with the BunnyGroup.
   * @private
   */
  assertValidCounts() {
    const live = this.liveBunnies.length;
    const dead = this.deadBunnies.length;
    const total = live + dead;
    const bunnyGroupLength = this.bunnyGroup.count;
    assert( live + dead === total && total === bunnyGroupLength,
      `bunny counts are out of sync, live=${live}, dead=${dead}, total=${total} bunnyGroupLength=${bunnyGroupLength}` );
  }
}

/**
 * Gets a suitable mate for a recessive mutant.
 * The mate must have the same mutant allele that caused the recessive mutant to mutate.
 * @param {Bunny} father
 * @param {Bunny[]} bunnies
 * @returns {Bunny|null} null if no mate is found
 */
function getMateForRecessiveMutant( father, bunnies ) {
  assert && assert( father instanceof Bunny, 'invalid father' );
  assert && assert( father.isOriginalMutant(), 'father must be an original mutant' );
  assert && assert( father.genotype.mutation, 'father must have a mutated genotype' );

  let mother = null;
  for ( let i = 0; i < bunnies.length && !mother; i++ ) {
    const bunny = bunnies[ i ];
    if ( bunny !== father && bunny.genotype.hasAllele( father.genotype.mutation ) ) {
      mother = bunny;
    }
  }
  return mother;
}

/**
 * Gets the cell in the Punnett square to use for an additional offspring.
 * If the Punnett square contains a homozygous mutation, that genotype is returned.
 * Otherwise, read the code comments :)
 * @param {PunnettSquare} punnettSquare
 * @param {Allele} mutantAllele
 * @param {Allele|null} dominantAllele
 * @returns {PunnettSquare.Cell}
 */
function getAdditionalPunnettCell( punnettSquare, mutantAllele, dominantAllele ) {
  assert && assert( punnettSquare instanceof PunnettSquare, 'invalid punnettSquare' );
  assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );
  assert && assert( dominantAllele instanceof Allele || dominantAllele === null, 'invalid dominantAllele' );

  let cell = null;

  // Look for homozygous mutation
  for ( let i = 0; i < punnettSquare.length && !cell; i++ ) {
    const currentCell = punnettSquare.getCell( i );
    if ( currentCell.fatherAllele === mutantAllele && currentCell.motherAllele === mutantAllele ) {
      cell = currentCell;
    }
  }

  // Fallback to dominant genotype
  if ( !cell && dominantAllele ) {
    for ( let i = 0; i < punnettSquare.length && !cell; i++ ) {
      const currentCell = punnettSquare.getCell( i );
      if ( currentCell.fatherAllele === dominantAllele || currentCell.motherAllele === dominantAllele ) {
        cell = currentCell;
      }
    }
  }

  // Fallback to random selection
  if ( !cell ) {
    cell = punnettSquare.getRandomCell();
  }

  assert && assert( cell, 'cell not found' );
  return cell;
}

naturalSelection.register( 'BunnyCollection', BunnyCollection );
export default BunnyCollection;