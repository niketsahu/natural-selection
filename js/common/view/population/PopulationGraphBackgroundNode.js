// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphBackgroundNode is the background for the Population graph, including dynamic grid lines and
 * tick marks.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const GRID_LINES_LINE_WIDTH = 1;
  const TICK_MARKS_LINE_WIDTH = 1;
  const TICK_MARKS_LENGTH = 4;
  const TICK_LABEL_SPACING = 3;
  const TICK_MARKS_FONT = new PhetFont( 10 );

  class PopulationGraphBackgroundNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {Object} [options]
     */
    constructor( populationModel, options ) {

      options = merge( {
        backgroundWidth: 100, // width in view coordinates
        backgroundHeight: 100 // height in view coordinates
      }, options );

      // Background rectangle
      const rectangleNode = new Rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight, {
        fill: NaturalSelectionColors.POPULATION_GRAPH_FILL
      } );

      // Grid lines for the x axis
      const xGridLines = new VerticalLines( populationModel.xMaximumProperty, {
        xAxisWidthModel: populationModel.xAxisWidth,
        xAxisWidth: options.backgroundWidth,
        xSpacingModel: populationModel.xAxisTickSpacing,
        lineLength: options.backgroundHeight,

        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH,

        // Clip to the background bounds, because we'll be horizontally translating the x grid lines
        clipArea: Shape.rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight )
      } );

      // Grid lines for the y axis
      const yGridLines = new HorizontalLines( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        yAxisHeight: options.backgroundHeight,
        lineLength: options.backgroundWidth,
        stroke: NaturalSelectionColors.GRID_LINES_STROKE,
        lineWidth: GRID_LINES_LINE_WIDTH
      } );

      // Group the grid lines, in case we want to be able to show/hide them in the future.
      const gridLinesNode = new Node( {
        children: [ xGridLines, yGridLines ]
      } );

      // Tick marks for the x axis
      const xTickMarks = new VerticalLines( populationModel.xMaximumProperty, {
        xAxisWidthModel: populationModel.xAxisWidth,
        xAxisWidth: options.backgroundWidth,
        xSpacingModel: populationModel.xAxisTickSpacing,
        lineLength: TICK_MARKS_LENGTH,

        stroke: NaturalSelectionColors.TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH,
        top: rectangleNode.bottom,

        // Clip to the tick mark bounds below the x axis, because we'll be horizontally translating the x tick marks
        clipArea: Shape.rectangle( 0, 0, options.backgroundWidth , options.backgroundHeight + TICK_MARKS_LENGTH )
      } );

      // Tick marks for the y axis
      const yTickMarks = new HorizontalLines( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        yAxisHeight: options.backgroundHeight,
        lineLength: TICK_MARKS_LENGTH,
        stroke: NaturalSelectionColors.TICK_MARKS_STROKE,
        lineWidth: TICK_MARKS_LINE_WIDTH,
        right: rectangleNode.left
      } );

      // Tick mark labels for the y axis
      const yTickLabels = new YTickLabels( populationModel.yMaximumProperty, () => populationModel.getYTickSpacing(), {
        yAxisHeight: options.backgroundHeight,
        right: yTickMarks.left - TICK_LABEL_SPACING
      } );

      // Group the tick marks, in case we want to be able to show/hide them in the future.
      const tickMarksNode = new Node( {
        children: [ xTickMarks, yTickMarks, yTickLabels ]
      } );

      // A crisp frame in the foreground, to hide overlapping of tick marks and grid lines
      const frameNode = new Rectangle( 0, 0, options.backgroundWidth, options.backgroundHeight, {
        stroke: NaturalSelectionColors.PANEL_STROKE,
        lineWidth: 1.5
      } );

      assert && assert( !options.children, 'PopulationGraphBackgroundNode sets children' );
      options.children = [ rectangleNode, gridLinesNode, tickMarksNode, frameNode ];

      super( options );
    }
  }

  /**
   * VerticalLines are used for x-axis tick marks and grid lines.  The x-axis tick spacing never changes, but the range
   * changes as time progresses.  So we create a single Shape for the vertical lines, then translate it as the
   * x-axis range changes.  Bounds are clipped to the background dimensions.
   */
  class VerticalLines extends Node {

    /**
     * @param {Property.<number>} xMaximumProperty - maximum of the x-axis range, in model coordinates
     * @param {Object} [options]
     */
    constructor( xMaximumProperty, options ) {

      options = merge( {
        xAxisWidthModel: 5, // width of the x axis, in model coordinates
        xSpacingModel: 1, // spacing between lines, in model coordinates
        xAxisWidth: 100, // width of the x axis, in view coordinates
        lineLength: 100 // vertical length of the lines, in view coordinates
      }, options );

      // Compute the number of lines and their spacing in view coordinates
      const numberOfLines = Math.floor( options.xAxisWidthModel / options.xSpacingModel ) + 1;
      const xSpacing = ( options.xSpacingModel / options.xAxisWidthModel ) * options.xAxisWidth;

      // Create the lines
      const shape = new Shape();
      for ( let i = 0; i < numberOfLines; i++ ) {
        const x = options.xAxisWidth - ( i * xSpacing );
        shape.moveTo( x, 0 );
        shape.lineTo( x, options.lineLength );
      }
      const path = new Path( shape, options );

      // Wrapped in a Node because we're going to translate the Path
      assert && assert( !options.children, 'VerticalLines sets children' );
      options.children = [ path ];

      // Translate the lines as time progresses
      xMaximumProperty.link( xMaximum => {
        path.x = -xSpacing * ( ( xMaximum % options.xSpacingModel ) / options.xSpacingModel );
      } );

      super(  options );
    }
  }

  /**
   * HorizontalLines are used for y-axis tick marks and grid lines.
   * They are recreated on demand, when the zoom control is used.
   */
  class HorizontalLines extends Path {

    /**
     * @param {Property.<number>} yMaximumProperty - maximum of the y-axis range, in model coordinates
     * @param {function:number} getYSpacing - gets the y-spacing for the current value of yMaximumProperty
     * @param {Object} [options]
     */
    constructor( yMaximumProperty, getYSpacing, options ) {

      options = merge( {
        yAxisHeight: 100, // y axis height, in view coordinates
        lineLength: 100 // line length, in view coordinates
      }, options );

      super( new Shape() );

      // Recreate the lines when the y-axis scale changes.
      yMaximumProperty.link( yMaximum => {

        // Compute the number of lines and their spacing in view coordinates
        const ySpacingModel = getYSpacing();
        const numberOfLines = Math.floor( yMaximum / ySpacingModel ) + 1;
        const ySpacing = ( ySpacingModel / yMaximum ) * options.yAxisHeight;

        // Create the grid lines
        const shape = new Shape();
        for ( let i = 0; i < numberOfLines; i++ ) {
          const y = options.yAxisHeight - ( i * ySpacing );
          shape.moveTo( 0, y );
          shape.lineTo( options.lineLength, y );
        }
        this.shape = shape;
      } );

      this.mutate( options );
    }
  }

  /**
   * YTickLabels is the y-axis tick mark labels. They are recreated on demand, when the zoom control is used.
   */
  class YTickLabels extends Node {

    /**
     * @param {Property.<number>} yMaximumProperty - maximum of the y-axis range, in model coordinates
     * @param {function:number} getYSpacing - gets the y-spacing for the current value of yMaximumProperty
     * @param {Object} [options]
     */
    constructor( yMaximumProperty, getYSpacing, options ) {

      options = merge( {
        yAxisHeight: 100 // y axis height, in view coordinates
      }, options );

      assert && assert( !options.children, 'YTickLabels sets children' );

      super();

      // Recreate the labels when the y-axis scale changes.
      yMaximumProperty.link( yMaximum => {

        //TODO duplication with HorizontalLines
        // Compute the number of tick marks and their spacing in view coordinates
        const ySpacingModel = getYSpacing();
        const numberOfTickMarks = Math.floor( yMaximum / ySpacingModel ) + 1;
        const ySpacing = ( ySpacingModel / yMaximum ) * options.yAxisHeight;

        // Create the tick mark labels
        const labelNodes = [];
        for ( let i = 0; i < numberOfTickMarks; i++ ) {

          const y = options.yAxisHeight - ( i * ySpacing );

          const labelNode = new Text( i * ySpacingModel, {
            font: TICK_MARKS_FONT,
            right: 0,
            centerY: y
          } );

          labelNodes.push( labelNode );
        }

        this.children = labelNodes;
      } );

      this.mutate( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphBackgroundNode', PopulationGraphBackgroundNode );
} );