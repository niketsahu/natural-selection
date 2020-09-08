// Copyright 2019-2020, University of Colorado Boulder

/**
 * MutationAlertsNode manages the position and visibility of 'Mutation Coming' alerts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import GenePool from '../model/GenePool.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import MutationComingNode from './MutationComingNode.js';

// constants
const X_OFFSET = -5;

class MutationAlertsNode extends Node {

  /**
   * @param {GenePool} genePool
   * @param {AddMutationsPanel} addMutationsPanel
   * @param {Object} [options]
   */
  constructor( genePool, addMutationsPanel, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( addMutationsPanel instanceof AddMutationsPanel, 'invalid addMutationsPanel' );

    options = merge( {}, options );

    // Create a MutationComingNode (aka 'alert') for each gene
    const mutationComingNodes = _.map( genePool.genes, gene => new MutationComingNode( gene ) );
    assert && assert( !options.children, 'MutationAlertsNode sets children' );
    options.children = mutationComingNodes;

    super( options );

    // When a mutation is coming, make its associated alert visible. unlinks are not necessary.
    mutationComingNodes.forEach( mutationComingNode => {
      mutationComingNode.gene.mutationComingProperty.link( mutationComing => {
        mutationComingNode.visible = mutationComing;
      } );
    } );

    // Alerts point at rows in the Add Mutations panel. Since rows can be dynamically hidden via PhET-iO, manage
    // the logistics of that here. unlink is not necessary.
    addMutationsPanel.boundsProperty.link( () => {
      mutationComingNodes.forEach( mutationComingNode => {

        // Position the alert to the left of its associated rows.
        const row = addMutationsPanel.getRow( mutationComingNode.gene );
        const globalPoint = row.parentToGlobalPoint( new Vector2( row.left, row.centerY ) ).addXY( X_OFFSET, 0 );
        mutationComingNode.rightCenter = mutationComingNode.globalToParentPoint( globalPoint );

        // If the row was made invisible for a gene that has a mutation was coming, cancel the mutation.
        if ( !row.visible && mutationComingNode.gene.mutationComingProperty.value ) {
          mutationComingNode.gene.cancelMutation();
        }
      } );
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

naturalSelection.register( 'MutationAlertsNode', MutationAlertsNode );
export default MutationAlertsNode;