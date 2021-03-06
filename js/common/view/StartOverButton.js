// Copyright 2019-2020, University of Colorado Boulder

/**
 * StartOverButton is the push button that is shown after all bunnies die, or bunnies take over the world.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class StartOverButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, {
      baseColor: NaturalSelectionColors.ADD_A_MATE_BUTTON,
      xMargin: 12,
      yMargin: 8,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true // because sim state controls when this button is visible
    }, options );

    assert && assert( !options.content, 'StartOverButton sets content' );
    options.content = new Text( naturalSelectionStrings.startOver, {
      font: NaturalSelectionConstants.PUSH_BUTTON_FONT,
      maxWidth: 150 // determined empirically
    } );

    super( options );
  }
}

naturalSelection.register( 'StartOverButton', StartOverButton );
export default StartOverButton;