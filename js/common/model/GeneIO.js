// Copyright 2020, University of Colorado Boulder

/**
 * GeneIO is the IO type for Gene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

class GeneIO extends ReferenceIO( ObjectIO ) {}

GeneIO.documentation = 'TODO';
GeneIO.validator = { isValidValue: value => value instanceof Gene };
GeneIO.typeName = 'GeneIO';
ObjectIO.validateSubtype( GeneIO );

naturalSelection.register( 'GeneIO', GeneIO );
export default GeneIO;