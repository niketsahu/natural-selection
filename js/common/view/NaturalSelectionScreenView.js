// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AbioticEnvironmentRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/AbioticEnvironmentRadioButtonGroup' );
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const AddMutationPanel = require( 'NATURAL_SELECTION/common/view/AddMutationPanel' );
  const EnvironmentalFactorsPanel = require( 'NATURAL_SELECTION/common/view/EnvironmentalFactorsPanel' );
  const GenerationClockNode = require( 'NATURAL_SELECTION/common/view/GenerationClockNode' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const MutationComingNode = require( 'NATURAL_SELECTION/common/view/MutationComingNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/PedigreeControlPanel' );
  const PedigreeNode = require( 'NATURAL_SELECTION/common/view/PedigreeNode' );
  const PopulationControlPanel = require( 'NATURAL_SELECTION/common/view/PopulationControlPanel' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/PopulationGraphNode' );
  const ProportionControlPanel = require( 'NATURAL_SELECTION/common/view/ProportionControlPanel' );
  const ProportionGraphNode = require( 'NATURAL_SELECTION/common/view/ProportionGraphNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {Tandem} tandem
     */
    constructor( model, viewProperties, tandem ) {

      super( {
        tandem: tandem
      } );

      const viewportNode = new ViewportNode( model.abioticEnvironmentProperty,
        0.75 * this.layoutBounds.width, 0.5 * this.layoutBounds.height, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      const generationClockNode = new GenerationClockNode( model.generationClock, model.selectionAgentsEnabledProperty, {
        centerX: viewportNode.centerX,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const abioticEnvironmentRadioButtonGroup = new AbioticEnvironmentRadioButtonGroup( model.abioticEnvironmentProperty, {
        right: viewportNode.right - NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const addAMateButton = new AddAMateButton( {
        listener: () => this.addAMate(),
        centerX: viewportNode.centerX,
        bottom: viewportNode.bottom - NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const rightOfWorldWidth = this.layoutBounds.width - viewportNode.width -
                                ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationPanel = new AddMutationPanel( {
        fixedWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: viewportNode.top
      } );

      //TODO for demo purposes only, these need to be placed based on rows in AddMutationsPanel
      const mutationComingParent = new VBox( {
        spacing: 16,
        children: [ new MutationComingNode(), new MutationComingNode(), new MutationComingNode() ],
        right: addMutationPanel.left + 10,
        top: addMutationPanel.top + 62
      } );

      const environmentalFactorsPanel = new EnvironmentalFactorsPanel(
        model.wolves.enabledProperty, model.toughFood.enabledProperty, model.limitedFood.enabledProperty, {
          fixedWidth: rightOfWorldWidth,
          left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
          top: addMutationPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      const graphWidth = 0.75 * viewportNode.width;
      const graphHeight = this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
                          viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      const leftOfGraphWidth = viewportNode.width - graphWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const populationGraphNode = new PopulationGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const populationControlPanel = new PopulationControlPanel(
        viewProperties.populationTotalVisibleProperty,
        viewProperties.populationValuesMarkerVisibleProperty, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: populationGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: populationGraphNode.centerY
        } );

      const populationParent = new Node( {
        children: [ populationControlPanel, populationGraphNode ]
      } );

      const proportionGraphNode = new ProportionGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const proportionControlPanel = new ProportionControlPanel( viewProperties.proportionValuesVisibleProperty, {
        fixedWidth: leftOfGraphWidth,
        maxHeight: graphHeight,
        right: proportionGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        centerY: proportionGraphNode.centerY
      } );

      const proportionParent = new Node( {
        children: [ proportionControlPanel, proportionGraphNode ]
      } );

      const pedigreeNode = new PedigreeNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const pedigreeControlPanel = new PedigreeControlPanel( model.pedigreeModel, {
        fixedWidth: leftOfGraphWidth,
        maxHeight: graphHeight,
        right: pedigreeNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        centerY: pedigreeNode.centerY
      } );

      const pedigreeParent = new Node( {
        children: [ pedigreeControlPanel, pedigreeNode ]
      } );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfWorldWidth,
        left: populationGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationGraphNode.centerY
      } );

      const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
        stepOptions: {
          listener: () => model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP )
        },
        left: proportionGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput();
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      // layering
      this.children = [
        viewportNode,
        generationClockNode,
        abioticEnvironmentRadioButtonGroup,
        addAMateButton,
        addMutationPanel,
        mutationComingParent,
        environmentalFactorsPanel,
        timeControlNode,
        populationParent,
        proportionParent,
        pedigreeParent,
        graphRadioButtonGroup,
        resetAllButton
      ];

      // @private
      this.model = model;
      this.generationClockNode = generationClockNode;
      this.addAMateButton = addAMateButton;
      this.proportionGraphNode = proportionGraphNode;

      viewProperties.graphProperty.link( graph => {
        populationParent.visible = ( graph === Graphs.POPULATION );
        proportionParent.visible = ( graph === Graphs.PROPORTION );
        pedigreeParent.visible = ( graph === Graphs.PEDIGREE );
      } );
    }

    /**
     * @public
     */
    reset() {
      this.addAMateButton.visible = true;
      this.proportionGraphNode.reset();
      //TODO
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }

    /**
     * Adds a mate.
     * @private
     */
    addAMate() {

      // model
      this.model.mateWasAddedProperty.value = true;

      // view
      this.addAMateButton.visible = false;
    }

    /**
     * Cancels a scheduled mutation.
     * @private
     */
    cancelMutation() {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );