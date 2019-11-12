// Copyright 2019, University of Colorado Boulder

/**
 * PopulationControlPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HSeparator = require( 'SUN/HSeparator' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PopulationCheckbox = require( 'NATURAL_SELECTION/common/view/PopulationCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const flatEarsString = require( 'string!NATURAL_SELECTION/flatEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const tallEarsString = require( 'string!NATURAL_SELECTION/tallEars' );
  const totalString = require( 'string!NATURAL_SELECTION/total' );
  const valuesMarkerString = require( 'string!NATURAL_SELECTION/valuesMarker' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  class PopulationControlPanel extends NaturalSelectionPanel {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        fixedWidth: 100,
        xMargin: 0
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Values Marker
      const valuesMarkerCheckbox = new Checkbox(
        new Text( valuesMarkerString, { font: NaturalSelectionConstants.CHECKBOX_FONT } ),
        populationModel.valuesMarkerVisibleProperty,
        NaturalSelectionConstants.CHECKBOX_OPTIONS );

      // ------
      const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
        stroke: NaturalSelectionColors.SEPARATOR_STROKE
      } );

      // Total
      const totalCheckbox = new PopulationCheckbox( populationModel.totalVisibleProperty, totalString, {
        color: NaturalSelectionColors.TOTAL_POPULATION
      } );

      // Checkbox for each allele
      const alleleCheckboxes = [

        // White Fur
        new PopulationCheckbox( populationModel.whiteFurVisibleProperty, whiteFurString, {
          color: NaturalSelectionColors.FUR,
          enabledProperty: populationModel.whiteFurEnabledProperty
        } ),

        // Brown Fur
        new PopulationCheckbox( populationModel.brownFurVisibleProperty, brownFurString, {
          color: NaturalSelectionColors.FUR,
          isMutation: true,
          enabledProperty: populationModel.brownFurEnabledProperty
        } ),

        // Tall Ears
        new PopulationCheckbox( populationModel.tallEarsVisibleProperty, tallEarsString, {
          color: NaturalSelectionColors.EARS,
          enabledProperty: populationModel.tallEarsEnabledProperty
        } ),

        // Flat Ears
        new PopulationCheckbox( populationModel.flatEarsVisibleProperty, flatEarsString, {
          color: NaturalSelectionColors.EARS,
          isMutation: true,
          enabledProperty: populationModel.flatEarsEnabledProperty
        } ),

        // Short Teeth
        new PopulationCheckbox( populationModel.shortTeethVisibleProperty, shortTeethString, {
          color: NaturalSelectionColors.TEETH,
          enabledProperty: populationModel.shortTeethEnabledProperty
        } ),

        // Long Teeth
        new PopulationCheckbox( populationModel.longTeethVisibleProperty, longTeethString, {
          color: NaturalSelectionColors.TEETH,
          isMutation: true,
          enabledProperty: populationModel.longTeethEnabledProperty
        } )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ valuesMarkerCheckbox, separator, totalCheckbox, ...alleleCheckboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PopulationControlPanel', PopulationControlPanel );
} );