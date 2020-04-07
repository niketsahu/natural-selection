// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNode is the view of a Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyNodeIO from './BunnyNodeIO.js';
import SpriteNode from './SpriteNode.js';

// constants
const IMAGE_SCALE = 0.4; // how much the bunny PNG images are scaled

class BunnyNode extends SpriteNode {

  /**
   * @param {Bunny} bunny
   * @param {Property.<Bunny>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof Property, 'invalid selectedBunnyProperty' );

    options = merge( {

      // Node options
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: BunnyNodeIO
    }, options );

    const image = new Image( bunnyWhiteFurStraightEarsShortTeethImage, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    // Rectangle that appears around this Node when bunny is selected
    const selectionRectangle = new Rectangle( image.bounds.dilated( 5 ), {
      stroke: 'blue',
      lineWidth: 2.5,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      center: image.center
    } );

    assert && assert( !options.children, 'BunnyNode sets children' );
    options.children = [ selectionRectangle, image ];

    // Red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    super( bunny, options );

    const pressListener = new PressListener( {

      // Select this bunny
      press: () => {
        selectedBunnyProperty.value = bunny;
      },

      tandem: options.tandem.createTandem( 'pressListener' )
    } );
    this.addInputListener( pressListener );

    // Indicate that this bunny is selected
    const selectedBunnyListener = someBunny => {
      selectionRectangle.visible = ( someBunny === bunny );
    };
    selectedBunnyProperty.link( selectedBunnyListener );

    // @private
    this.disposeBunnyNode = () => {
      pressListener.dispose();
      selectedBunnyProperty.unlink( selectedBunnyListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    super.dispose();
    this.disposeBunnyNode();
  }
}

export default naturalSelection.register( 'BunnyNode', BunnyNode );