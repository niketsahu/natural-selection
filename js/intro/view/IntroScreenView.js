// Copyright 2019-2020, University of Colorado Boulder

/**
 * IntroView is the view for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionScreenView from '../../common/view/NaturalSelectionScreenView.js';
import naturalSelection from '../../naturalSelection.js';
import IntroModel from '../model/IntroModel.js';

class IntroScreenView extends NaturalSelectionScreenView {

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    assert && assert( model instanceof IntroModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, {

      // Hide the user-interface for the Ears, Teeth, and Tough Food features.
      // See see https://github.com/phetsims/natural-selection/issues/70.
      earsVisible: false,
      teethVisible: false,
      toughFoodCheckboxVisible: false,

      // phet-io
      tandem: tandem
    } );
  }
}

naturalSelection.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;