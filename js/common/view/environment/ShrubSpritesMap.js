// Copyright 2020, University of Colorado Boulder

/**
 * ShrubSpritesMap manages the Sprites used for tough and tender food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sprite from '../../../../../scenery/js/util/Sprite.js';
import tenderShrub1Image from '../../../../images/tenderShrub1_png.js';
import tenderShrub2Image from '../../../../images/tenderShrub2_png.js';
import tenderShrub3Image from '../../../../images/tenderShrub3_png.js';
import toughShrub1Image from '../../../../images/toughShrub1_png.js';
import toughShrub2Image from '../../../../images/toughShrub2_png.js';
import toughShrub3Image from '../../../../images/toughShrub3_png.js';
import naturalSelection from '../../../naturalSelection.js';
import OrganismSpriteImage from './OrganismSpriteImage.js';

class ShrubSpritesMap {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @private {Sprite[]} sprites for tender food
    this.tenderSprites = [
      new Sprite( new OrganismSpriteImage( tenderShrub1Image ) ),
      new Sprite( new OrganismSpriteImage( tenderShrub2Image ) ),
      new Sprite( new OrganismSpriteImage( tenderShrub3Image ) )
    ];

    // @private {number} index of the next sprite to use for tender food
    this.tenderSpritesIndex = 0;

    // @private {Sprite[]} sprites for tough food
    this.toughSprites = [
      new Sprite( new OrganismSpriteImage( toughShrub1Image ) ),
      new Sprite( new OrganismSpriteImage( toughShrub2Image ) ),
      new Sprite( new OrganismSpriteImage( toughShrub3Image ) )
    ];

    // @private {number} index of the next sprite to use for tough food
    this.toughSpritesIndex = 0;
  }

  /**
   * Gets the complete set of Sprites related to shrubs.
   * @returns {Sprite[]}
   * @public
   */
  getSprites() {
    return this.tenderSprites.concat( this.toughSprites );
  }

  /**
   * Gets the next sprite to use for tender shrubs.
   * @returns {Sprite}
   * @public
   */
  getNextTenderSprite() {
    const sprite = this.tenderSprites[ this.tenderSpritesIndex++ ];
    if ( this.tenderSpritesIndex >= this.tenderSprites.length ) {
      this.tenderSpritesIndex = 0;
    }
    return sprite;
  }

  /**
   * Gets the next sprite to use for tough shrubs.
   * @returns {Sprite}
   * @public
   */
  getNextToughSprite() {
    const sprite = this.toughSprites[ this.toughSpritesIndex++ ];
    if ( this.toughSpritesIndex >= this.toughSprites.length ) {
      this.toughSpritesIndex = 0;
    }
    return sprite;
  }
}

naturalSelection.register( 'ShrubSpritesMap', ShrubSpritesMap );
export default ShrubSpritesMap;