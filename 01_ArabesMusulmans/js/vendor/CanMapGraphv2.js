// @from : https://gist.github.com/marcneuwirth/2865882

// var this.conf.chart = {} ;

var Jammu = 'Jammu and Kashmir' ; 

var CanMapGraph = function( object ){

  // default conf
  this.default_conf = { 
        'id'            : '#svg', 
        'width'         : undefined , 
        'height'        : undefined , 
        'container'     : '#map-container' , 
        'type'          : 'map' , 
        'title'         : null ,                                    // title of the globcal chart
        'title_src'     : null ,
        'css'           : '',                                       // specific css to override styles
        'host_data'     : 'http://localhost/',
        'simple_map'    : false , 
        'width'         : null ,                                    // global chart width
        'height'        : null ,                                    // globcal chart height
        'labels'        : null ,                                    // from which field to take labels
        'values'        : null,                                     // from which field to take values
        'responsive'    : true,                                     // add a responsive manager,
        'data'          : {
            'format' : 'csv',                                       // csv - json 
            'url'    : 'data/data.csv' ,                            // url of data 
            'src'    : { 'data' : [] }   
        } , 
        'tooltip'   : {
            'decimal' : 1 , 
            'dividor' : 10 , 
        } , 
        'chart' : {
            'scale'         : 180 , 
            'globe_scale'   : 200 , 
            'globe_translate' : { 'x' : 0 , 'y' : 50 } , 
            'translate'     : null , 
            'key_data'      : 'id',
            'mode'          : 'heat' , // heat or bubble
            'hd'            : false , 
            'show_background' : true , 
            'background_globe' : '#EDF9FC',
            'projection'    : 'natural-earth',
            'background'    : 'transparent',
            'graticule'     : false , 
            'callback_click'      : undefined , 
            'callback_mousehover' : undefined , 
            'callback_mouseout' : undefined , 
            'hook_value'    : 'roundProportion',
            'legend'        : true, 
            'legend_values' : true , 
            'legend_color'  : 'Blues' , 
            'legend_translate' : {'x' : 120 , 'y' : 0 } ,
            'tooltip_translate' : {'x' : 20 , 'y' : 70 } ,
            'legend_title' : '' , 
            'legend_decimal' : 1 , 
            'legend_suffix' : '%',
            'legend_font_size' : '12px', 
            'legend_width_rect': 25 , 
            'legend_height_rect': 10 , 
            'legend_space_after_rect' : 35 ,
            'legend_space_between_line' : 15 ,  
            'legend_space_between_text' : 7 , 
            'legend_sub_adjustment' : 0 , 
            'legend_last_value_x' : 130 , 
            'legend_last_value_y' : 35 , 
            'fill_color'    : undefined , 
            'nb_colors'     : 6 , 
            'colors'        : undefined , 
            'color_scale'   : 'quantize' , 
            'key_data_value': 'value', 
            'key_label_value' : null , 
            'key_suffix_value' : '' ,
            'stroke_color'  : 'rgba(100, 100, 100,0.7)',
            'range_colors' : [] , 
            'jump_to_init'  : {
                'delay' : 1500 , 
                'iso_code' : 'random'
            }, 
            'copyright' : undefined , 
            'delay_bubble' : 1000 , 
            'duration_bubble' : 1500 , 
            'range_radius' : [0,15] , 
            'bubble_color' : '#993404' , 
            'show_empty_value' : false , 
            'grouping_color' : false , 
            'transition_duration' : 500
        }
        ,
        'downloads' : {                                             // set download buttons if false = hide all
            'icons': true, 
            'png' : true , 
            'pdf' : true ,
            'svg' : true ,
            'json': true , 
            'csv' : true ,
            'xml' : true
        },
        'copyright' : true , 
        'filters' : [
            {
                'type'      : 'select',
                'multiple'  : false,
                'title'     : 'Cancer',   
                'data_url'  : 'api.php/globocan2012_cancer?transform=1' , 
                'data_key'  : 'key',
                'data_label': 'label'
            },
            {
                'type'      : 'radio',
                'multiple'  : false,
                'title'     : 'Filter by sex',
                'data'      : [
                    {'label' : 'Male','key' : 'male'},
                    {'label' : 'Female','key' : 'female', 'checked' : true}]
            }
        ]                             
    } ;

    // global conf
    // this.conf        = object.setConf( object.config , this.default_conf ) ;  
    // this.conf.chart     = object.setConf( object.config , this.default_conf ) ;  
    this.conf           = object.config ; 
    this.conf           = object.setConf( object.config , this.default_conf ) ;  

    //console.log( this.conf ) ; 
    // this.conf.chart     = object.config ; 
    this.projections_indexes = { "aitoff" : 0 , "globe" : 1 , "mercator" : 2 , "natural-earth" : 3 } ; 

    // local dataset saved
    this.current_dataset = [] ; 

    // map direction 
    this.map_sens        = 0.25 ; 
};

/*var CanMapSvg, CanMapGroup , CanCircleGroup , 
    this.width , this.height , this.map_projection, CanMapBubblesData , 
    CanGraphMapColor , CanGraphMapColorQuantile, CanGraphMapPath , CanGraphGeometries , CanGraphCountries , this.chart_key = 'asr', CanGraphMapFeatures ,
    CanMapTooltip, CanMapCurrentType = 0, CanGraphMapZoom, CanGraphMapCentered , CanGraphMapLegend, CanMapGraphNbColors = 5,
    CanMapUniqueValues , 
    CanMapRotate = [20, 0],
    CanMapVelocity = [-.040, -0.000] ,
    // CanMapRotate = [20, 0],
    // CanMapVelocity = [0.09, 0] ,
    CanMapRotate = [10, 0],
    CanMapVelocity = [-.005, 0] , // [-.005, -0.001]
    CanMapSens = 0.25, 
    focusedCountry, focused, 
    isTurning = false , 
    isMonoColor = false , 
    CanGraphMaxValue , CanGraphRadiusBubble , 
    this.lines , this.poly , 
    currentMonoColor , 
    currentClickedColors , 
    CanMapColorSet, 
    CanMapCurrentRotation = undefined , 
    CanMapCurrentZoomInfos = undefined 
;

var CanGraphMapProjections ,  CanGraphMapProjectionsI = { "aitoff" : 0 , "globe" : 1 , "mercator" : 2 , "natural-earth" : 3 } ; 
*/

CanMapGraph.prototype = {
  
    /**
    * Manage launch 
    */
    launch : function( oCanGraph ){

        oCanGraph= undefined ; 
        // avoid issue for "this" properties confused with "this" local var
        self = this ; 

        // console.info( "Launch" , this.conf.container ) ; 

        this.width = ( this.conf.width != undefined ) ? this.conf.width : $( this.conf.container ).width() ,
        this.height = ( this.conf.height != undefined ) ? this.conf.height : 700 ;
        this.id = this.conf.id ; 
        this.container = this.conf.container ; 
        this.chart_key = this.conf.chart.key_data_value ; 

        // console.log( this.conf.chart ) ; 
        this.conf.chart.projections = [
          { name: "Aitoff", projection: d3.geo.aitoff()},
          { name: "Globe", projection : d3.geo.orthographic().scale(this.conf.chart.globe_scale).translate([this.width/2,this.conf.chart.globe_translate.y]).rotate([0,0]).clipAngle(100 + 1e-6).precision(.3)  }, //.origin([-71.03,42.37])},
          { name: "Mercator", projection: d3.geo.mercator()},
          { name: "Natural Earth", projection: d3.geo.naturalEarth().scale(this.conf.chart.scale).translate( (this.conf.chart.translate == null) ? [this.width/2,320] : this.conf.chart.translate )}
        ];

        /*options.forEach(function(o) {
          o.projection.rotate([0, 0]).center([0, 0]);
        });*/

        var i = 0 ,
            n = this.conf.chart.projections.length - 1 ;

        this.map_projection = this.conf.chart.projections[ this.projections_indexes[ this.conf.chart.projection ] ].projection;
        this.map_path = d3.geo.path().projection( this.map_projection );

        if ( this.conf.chart.graticule ) var graticule = d3.geo.graticule();

        this.map_svg = d3.select( this.conf.container ).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", this.id )
            // .on("mousedown", mapMouseDown )
        ;

        // console.info( 1 , "this.map_svg", this.map_svg );

        this.map_svg.append("path")
            .datum({type: "Sphere"})
            .attr("stroke","none")
            .attr("id", "sphere" + this.id)
            .attr("d", this.map_path)
            .attr("fill", this.conf.chart.background_globe )
        ;

        // the background
        if ( this.conf.chart.show_background == true )
        {
            var Sphere = this.map_svg.append("use")
                .attr("class", "stroke")
                .attr("xlink:href", "#sphere")
                .attr('fill','transparent')
                .style('fill','transparent')
            ;

            var fillSphere = this.map_svg.append("use")
                .attr("class", "fill")
                .attr("xlink:href", "#sphere")
                .style('fill', this.conf.chart.background )
            ;
        }


        // if ( this.conf.chart.graticule )
        this.map_svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", this.map_path)
            .style('fill', this.conf.chart.background )
        ;

        if ( this.conf.chart.projection == 'globe' )
        {
            this.map_group = this.map_svg.append("g")
                 .attr('class','mapGroup')
            ;
        }
        else
        {
            this.map_group = this.map_svg.append("g")
                 .attr('class','mapGroup')
                 .attr('id','mapGroup'+this.conf.id)
                 .attr("transform", "translate("+this.conf.chart.globe_translate.x+","+this.conf.chart.globe_translate.y+")")
            ;
        }

        this.preLoadMapData(); 
    }, 

    /**
    * Prepare data for geometries + countries csv for "relationnal" mapping (iso,country code, globocan id ... )
    * @params no param
    * @return object
    */ 
    preLoadMapData : function() {

        // queue function loads all external data files asynchronously 

        let url_json = ( this.conf.chart.hd == true ) ? "data/map/world-who-out.geojson" : "data/map/world-general.topojson" ; 

        queue()     
            .defer( d3.json, url_json ) // our geometries
            .defer( d3.csv, "data/countries_un.csv" )  // our data specific
            .await(( error , geometries , countries ) => { 

                // console.info( 2 , "preLoadMapData" , this.container ) ; 

                this.geometries = geometries ; 
                this.countries = countries ;    

                // call the "filtering" data function 
                // jsonUrl = this.conf.chart.data.url ;
                // this.loadMapFilterData( jsonUrl , ( this.conf.chart.colors == undefined ) ? "Blues" : this.conf.chart.colors , processData ) ; 
                
                this.processData( this.conf.data.src ) ; 

                return { 'geometries' : geometries , 'countries' : countries } ; 

            });   // once all files are loaded, call the processData function
    } , 

    /**
    * First run processing data 
    * @param (array) data from "search" results
    * @return (array)
    */ 
    processData : function( dataset_in ) {

        this.current_dataset = dataset_in ;
        
        // link data to geometries
        this.grabValues( this.geometries , this.countries , dataset_in ) ;

        this.map_color = this.setMapColor( this.conf.chart.colors , dataset_in );

        // draw path
        this.drawMap( this.geometries );  // let's draw new data set
        
        // update legends
        this.manageLegends(); 

        // manage title of map
        // if ( this.conf.chart.title != false)  this.manageMapTitle( predictions.title ) ; 
        
        // auto spin globle
        // spinGlobe();

        return this.geometries ; 
    } , 


    /**
    * Draw the map from geometries geojson 
    * @param (array) list of geometries
    * @return (object)
    */ 
    drawMap : function( world ) {   

        // console.info( world.features ) ; 

        if ( this.conf.chart.hd == true )
        {
            this.map_features = this.map_group.selectAll(".country")   // select country objects (which don't exist yet)
                .data( world.features ) ; // bind data to these non-existent objects
        }
        else
        {
            this.map_features = this.map_group.selectAll(".country")   // select country objects (which don't exist yet)
                .data( topojson.object( world, world.objects['general']).geometries ) ; // bind data to these non-existent objects
        }

        // console.info( topojson.object( world, world.objects['general']).geometries ) ; 
        this.map_features.enter().append("path") // prepare data to be appended to paths
            .attr("class", function(d){ 
                var class_no_data = '' ; 
                // console.log( d.properties.values ) ; 
                if ( d.properties.values != undefined && d.properties.values.no_data == true ) class_no_data = 'no_data' ; 
                return "country type"+self.chart_key+" "+class_no_data ; 
            }) // give them a class for styling and access later
            .attr("fill", (d) => { 
                let fill_color =  this.findColorByItem(d) ; 
                return fill_color ; 
            })
            // .attr("default-fill", (d) => { return self.findColorByItem(d) ; })
            .attr('stroke', (d) => { 
                let fill_color =  this.findColorByItem(d) ; 
                if ( fill_color == '#ffffff')
                    return '#cccccc' ; 
                else
                    return fill_color ; 
            })
            .attr('stroke-width', '1px' )
            .attr("id", (d) => { return "code_" + d.properties.ISO_3_CODE ; }, true) // give each a unique id (check with graph global conf)
            .attr("d", this.map_path) // create them using the svg path generator defined above

            .call(

                d3.behavior.drag()
                    .origin( () => { 
                        var r = this.map_projection.rotate(); 
                        return { x: r[0] / this.map_sens , y : -r[1] / this.map_sens}; 
                    })
                    .on("drag", () =>  {

                        if ( this.conf.chart.projection != 'globe' ) return ; 
                        
                        var rotate = this.map_projection.rotate() ;
                        
                        if ( this.conf.chart.projection == 'globe' )
                        {
                            // if globe, we can rotate according to mouse movements
                            // console.info( d3.event.x * this.map_sens , -d3.event.y * this.map_sens , rotate[2] ) ; 
                            this.map_rotate = [d3.event.x * this.map_sens, -d3.event.y * this.map_sens, rotate[2] ] ; 
                            this.map_projection.rotate( this.map_rotate );
                        }
                        else
                        {
                            // only drag onx for classic map
                            this.map_projection.rotate([d3.event.x * this.map_sens, 0]);
                        }

                        this.map_svg.selectAll(".country").attr("d", this.map_path );
                        this.poly.selectAll(".poly").attr("d", this.map_path);
                        this.lines.selectAll(".line").attr("d", this.map_path);
                    
                    }) // end function 
            ) ; 

        ;

        // console.info( 3 , "drawMap" , this.map_svg ) ; 
        if ( this.conf.chart.hd == false )
        {
            // polygone for lakes mostly
            this.poly = this.map_svg.append("g").attr('class','poly') 
                .attr("d", this.map_path)
                .attr("transform", "translate("+this.conf.chart.globe_translate.x+","+this.conf.chart.globe_translate.y+")")
            ;

            this.poly.selectAll("path")
                .data( topojson.object( this.geometries , this.geometries.objects.maskpoly_general ).geometries )
                .enter()
                .append("path")
                .attr("d", this.map_path )
                .attr('class', function(d){ 
                    return 'poly' ;
                })
                .style('fill', (d) => {
                    if ( d.properties.AREA == Jammu )
                        return Default.color_not_applicable ; 
                    else
                        return this.conf.chart.background_globe ; 
                })
                .style('stroke','#000000')  
                .style('stroke-dasharray', (d) => {
                    if ( d.properties.AREA == Jammu )
                        return 0 ; 
                    else
                        return 0 ; 
                })  
                .style('stroke-width', Default.dash_border )
                .append("title").text(function(d){ return d.properties.AREA ; }) ; 

            // draw layer 2 & 3 borders + lines for very small countries
            this.lines = this.map_svg.append("g")
                .attr('class','line') 
                .attr("transform", "translate("+this.conf.chart.globe_translate.x+","+this.conf.chart.globe_translate.y+")")
            ;

            this.lines.selectAll("path")
                .data( topojson.object( this.geometries , this.geometries.objects.maskline_general ).geometries )
                .enter()
                .append("path")
                .attr("d", this.map_path )
                .attr('class',function(d){ 

                    return 'line line-'+d.properties.ID+' '+d.properties.class;
                })
                // fill : none ; stroke : #92919D ;        stroke-width: #92919D ;
                .style('fill','none')
                .style('stroke','#000000')
                .style('stroke-width','0.5px')
                .append("title").text(function(d){ return d.properties.COUNTRY ; })

            this.lines.selectAll('.line-1,.line-4,.line-5,.line-7,.line-8')
                .style('fill','none')
                .style('stroke','#ffffff')
                .style('stroke-dasharray', Default.dash_array_border  +','+Default.dash_array_border )  
                .style('stroke-width', Default.dash_border ) ; 

            d3.select('g.poly path:last-child').style('fill','rgb(125, 125, 125)');
        }

        if ( this.conf.chart.mode == 'bubble')
        {   
            var colorset = CanGraphMapColor.range() ;

            // console.info(world.objects['general']) ; 
            // console.info( topojson.object( world, world.objects['general']).features ) ; 

            CanCircleGroup = this.map_svg.append("g")
                .attr('class','circleGroup')
                .attr("transform", "translate(0,"+this.conf.chart.globe_translate.y+")")
            ;

            CanMapBubblesData = topojson.object( world, world.objects['general']).geometries ; 
            // reordering to build biggest bubbles before
            for ( var it in CanMapBubblesData ) CanMapBubblesData[it].value = CanMapBubblesData[it].properties.values[ this.conf.chart.key_data_value ] ; 
            sortByKey( CanMapBubblesData , 'value') ; 

            CanCircleGroup.append("g")
                .selectAll("circle")
                .data( CanMapBubblesData )
                .enter().append("circle")
                .attr("class","bubble")
                .style('fill', this.conf.chart.bubble_color )
                .style('fill-opacity', 0.7)
                .style('stroke','#ffffff')
                .style('stroke-width','.5px')
                .attr("transform", function(d) { return "translate(" + this.map_path.centroid(d) + ")"; })
                .attr("r",0)
                .on('mouseover',function(d){
                    return ; 
                    d3.select(this)
                        .style('stroke-width','1px')
                        .style('fill-opacity',0.3) ; 
                    if ( this.conf.chart.callback_mousehover != undefined ) window[this.conf.chart.callback_mousehover](d,this) ;

                })
                .on("mouseout", function(d){
                    return ; 
                    d3.select(this)
                        .style('stroke-width','.5px')
                        .style('fill-opacity', 1 ) ; 
                    if ( this.conf.chart.callback_mouseout != undefined ) window[this.conf.chart.callback_mouseout](d,this) ;
                })
            ;
            
            d3.selectAll('.bubble').transition()
                .duration( this.conf.chart.duration_bubble )
                .attr('r',function(d){
                    var value = d.properties.values[ this.conf.chart.key_data_value ]  ; 
                    return ( value == 0 ) ? 0 : CanGraphRadiusBubble( value  ) ; 
                })
                .delay(function(d,i){
                    return this.conf.chart.delay_bubble ;
                })
            ; 
            
        } // end if bubble


        return this.geometries ; 
    },

    reload : function( dataset , settings ){

        this.chart_key  = ( settings.key != undefined) ? settings.key : this.conf.chart.key_data_value ; 
        CanMapCurrentType   = settings.type ; 

        // this.conf.chart.src = dataset ; 
        // this.conf.chart.color_scale = settings.color_scale ;

        var label = ( settings.key == 'cum0_74') ? 'Cum. risk' : settings.key.toUpperCase() ;
        // this.conf.chart.key_label_value = label ; 

        this.setMapColor( settings.color , dataset );

        this.processUpdateData({ 'title' : '' , 'data' : dataset }) ; 

    } , 

    /**
    * X run processing data after path all exist
    * @param (array) data from "search" results
    * @return (array)
    */
    processUpdateData : function ( dataset_in ) {

        //console.info( "processUpdateData" ) ; 

        if ( CanGraphMapFeatures == undefined ) return ; 

        this.current_dataset = predictions ;

        // attach new values 
        this.grabValues(this.geometries,this.countries,predictions) ;

        // console.info( this.geometries ) ; 
        if ( this.conf.chart.mode == 'heat' )
        {
            // select all path geometries
            // CanGraphMapFeatures = d3.selectAll('.country').data( topojson.object(this.geometries, this.geometries.objects['general']).geometries ) ; 

            // transition color for feach path 
            CanGraphMapFeatures.transition()  //select all the countries and prepare for a transition to new values
                .duration(this.conf.chart.transition_duration)  // give it a smooth time period for the transition
                .attr("class", function(d){ 

                    var class_no_data = '' ; 

                    if ( d.properties.values.no_data == true ) class_no_data = 'no_data' ; 

                    return "country type"+CanMapCurrentType +' '+class_no_data ; 
                })
                .attr('fill', function(d) {
                    
                    if ( this.conf.chart.mode == 'heat')
                    {   
                        // console.info(d.id,d.properties.values.value,CanGraphMapColor(d.properties.values.value));
                        return findColorByItem(d);
                    }
                    else if ( this.conf.chart.mode == 'bubble')
                    {
                        return Default.color_no_data ; 
                    }
                }) 
                .attr('default-fill', function(d) { 
                    return findColorByItem(d);
                });
            ; 
        }
        else if ( this.conf.chart.mode == 'bubble')
        {   
            // select all bubbles
            var GraphBubbles = d3.selectAll('.bubble').data( topojson.feature( this.geometries, this.geometries.objects['general'] ).features ) ; 

            var colorset = CanGraphMapColor.range() ;

            GraphBubbles.transition()
                .duration(this.conf.chart.transition_duration)
                .attr("r", function(d){ 
                    var radius = CanGraphRadiusBubble( d.properties.values[ this.conf.chart.key_data_value ] ) ; 
                     // console.info( radius , d.properties.values[ this.conf.chart.key_data_value ] ) ; 
                    radius = 5 ; 
                    return radius ; 

                }) 
                .style('fill', colorset[ colorset.length - 1] )
            ; 
        }



        // update legends
        if ( this.conf.chart.mode == 'heat') this.manageLegends(); 
        
        // update title
        if ( this.conf.chart.title != false) manageMapTitle(predictions.title) ;

        return this.geometries ; 
    } , 

    /**
    * Apply fill/color to the country, depending on parameter
    * @param (objet) item 
    * @return (string) color 
    */
    findColorByItem : function ( d ){

        if ( d.properties.values == undefined ) return Default.color_no_data ; 

        if ( this.conf.chart.mode == 'heat')
        {                
            // console.info( d.properties.values ) ; 

            if ( d.properties.values.not_applicable == true || d.id == 'ESH' || d.properties.country == 'Abyei' || d.properties.country == Jammu ){
                return Default.color_not_applicable ; 
            }

            if ( d.properties.values.no_data == true)
                return Default.color_no_data ; 

            // properties 1: force color with .color key
            if ( d.properties.values.color != undefined)  {
                return d.properties.values.color ; 
            }

            // propertie 2 force color with .fill_color key
            if ( this.conf.chart.fill_color != undefined ){
                return this.conf.chart.fill_color ; 
            }

            // no values
            if (d.properties.values == undefined){
                return this.map_color(0); 
            }
            
            /*if ( d.properties.values.asr != undefined && d.properties.values.asr != 0 )
                return CanGraphMapColor( d.properties.values.asr )*/

            // base on default key
            if ( d.properties.values.value != undefined ){
                return this.map_color( d.properties.values.value )
            }
        }
        else if ( this.conf.chart.mode == 'bubble')
        {
            return Default.color_no_data ; 
        }

    } , 

    /**
    * Trigger when window is resized
    * @params no param
    * @return no return 
    */ 
    resize : function(){

        return true ; 
    }, 

    changeTitle : function( new_title ){
        
        //$( this.conf.chart.container+ ' #chart-title').text( new_title );

        if ( typeof(new_title) == 'object' )
        {
          txt.append('tspan').attr('x', sunBurstConf.width  / 2).attr('y',30).text(new_title[0]); 
          txt.append('tspan').attr('x', sunBurstConf.width / 2).attr('y',45).text(new_title[1]); 
          if (new_title[2] != undefined) 
            txt.append('tspan').attr('x', sunBurstConf.width / 2).attr('y',60).text(new_title[2]); 
        }
        else
        {
          txt.text( new_title ) ; 
        }
    }
    ,
    /**
    * Manage legend from new color range
    * @param (no param)
    */ 
    manageLegends : function ()
    {   

        $( this.container + ' #' + this.id+ ' g.groupLegend').remove(); 
        
        // console.info( "manageLegends" , this.conf.chart.legend ) ; 
        // console.info(" this.conf.chart.legend " , this.conf.container ,  this.conf.chart.legend , this.colorset ) ; 
        
        if ( this.conf.chart.legend == true )
        {
            var colorset = this.colorset ;
            // console.info( "this.unique_values" , this.unique_values , "=" , this.unique_values.length , "colorset = " , colorset.length ); 

            if ( this.unique_values.length <= colorset.length ) 
            {
                // colorset.reverse(); 
                colorset = this.colorset.slice(0, colorset.length ) ;
                var data_colors = Array.prototype.slice.call( colorset );
            }
            else
            {
                var data_colors = Array.prototype.slice.call( colorset );
                // data_colors.reverse(); 
            }
            
            data_colors.reverse(); 

            // console.info( 'manageLegends' , ' => ' , this.map_svg ) ; 
            this.group_legends = this.map_svg.append('g').attr('class','groupLegend') ;

            var containerLegend = this.group_legends.append('rect')
                .attr('class','containerLegend')
                .attr("x", this.conf.chart.legend_translate.x - 15 ) 
                .attr("y", 400 )
                .style('width', 140 )
                .style('height', 153 )
                .style('fill','transparent') 
                // .style('stroke','#000000')
            ;   

            // reverse gradient (start bottom to top)
            data_colors.reverse(); 

            // console.info( data_colors ) ;
            
            this.map_legend = this.group_legends.selectAll('g.legendEntry')
                .data( data_colors )
                .enter()
                .append('g')
                .attr('class', 'legendEntry') ;


            //the data objects are the fill colors
            
            if ( this.unique_values.length == colorset.length ) 
                var last_values_y = 4 * this.unique_values.length  ; 
            else
                var last_values_y = 17 ; 

            // sort descending 
            this.unique_values.sort(function(a, b) {return a - b;}) ; 

            // console.info( data_colors.length ) ; 
            this.conf.chart.legend_last_value_y = ( data_colors.length == 5 ) ? 50 : 35 ; 

            // put the 2 last rows on the right 
            let space_left_last = this.conf.chart.legend_last_value_x ;
            let space_bottom_last = this.conf.chart.legend_last_value_y ; 

            console.info("=>",space_bottom_last);

            var pointer_x = this.conf.chart.legend_translate.x ; 
            var pointer_y = this.conf.height - this.conf.chart.legend_translate.y ; // going up  

            // No data rectangle
            this.group_legends
                .append('rect')
                .attr('class','rect_Legend')
                .attr("x", pointer_x + space_left_last ) 
                .attr('y', pointer_y - space_bottom_last )
                .attr("width", this.conf.chart.legend_width_rect )
                .attr("height", this.conf.chart.legend_height_rect )
                .style("stroke","#cccccc")
                .style("stroke-width", "0.5px")
                .style("fill", function(d){ return Default.color_no_data ;})

            // No data text
            this.group_legends
                .append('text')
                .attr('class','text_Legend')
                .attr("x",  pointer_x + space_left_last + this.conf.chart.legend_space_after_rect )  // leave 5 pixel space after the <rect>
                .attr("y", pointer_y - space_bottom_last + ( this.conf.chart.legend_space_between_text + 2 )  )  // + (this.height - 200);})
                .style('font-size',this.conf.chart.legend_font_size)
                //.attr("dy", "0.9em") // place text one line *below* the x,y point
                .text("No data") ;

            // Not applicable rectangle
            this.group_legends
                .append('rect')
                .attr('class','rect_Legend')
                .attr("x", pointer_x + space_left_last ) 
                .attr("y",  pointer_y - space_bottom_last - this.conf.chart.legend_space_between_line )
                .attr("width", this.conf.chart.legend_width_rect )
                .attr("height", this.conf.chart.legend_height_rect )
                .style("stroke","#cccccc")
                .style("stroke-width", "0.5px")
                .style("fill", function(d){ return Default.color_not_applicable ;})

            // Not applicable text
            this.group_legends
                .append('text')
                .attr('class','text_Legend')
                .attr("x",  pointer_x + space_left_last + this.conf.chart.legend_space_after_rect )  // leave 5 pixel space after the <rect>
                .attr("y", pointer_y - space_bottom_last - this.conf.chart.legend_space_between_text + this.conf.chart.legend_sub_adjustment  )  // + (this.height - 200);})
                .style('font-size',this.conf.chart.legend_font_size)
                //.attr("dy", "0.9em") // place text one line *below* the x,y point
                .text("Not applicable") ; 

            // show rectangles 
            var pointer_y_rectangles = pointer_y - ( ( this.conf.chart.legend_height_rect * 2 ) + this.conf.chart.legend_space_between_line ) ; 

            if ( this.conf.chart.legend_values == true )
            {
                this.map_legend
                    .append('rect')
                    .attr('class','rect_Legend')
                    .attr("x", pointer_x ) 
                    .attr("y", function(d, i) {
                        return pointer_y_rectangles - ( (i * self.conf.chart.legend_space_between_line) + 2 )   ; 
                    })
                   .attr("width", this.conf.chart.legend_width_rect )
                   .attr("height", this.conf.chart.legend_height_rect )
                   .style("stroke","#cccccc")
                   .style("stroke-width", "0.5px")
                   .style("display", (d) => {
                        var extent = this.map_color.invertExtent(d) ;
                        // if ( extent[0] == 0 && extent[1] == 0 && self.conf.chart.color_scale == 'quantile') return 'none' ; 
                        return "block";
                    })
                   .attr('color', (d) => { return d; })
                   .style("fill", (d) => { return d; })
                   .on("click", ( color_clicked ) => { return ;  this.manageColorClicked( color_clicked ) ;  })
                   /*.on("mouseover", function( color_mousehover ){ manageColorHover( color_mousehover ) ; })
                   .on("mouseout", function( color_mouseout ){ manageColorMouseOut( color_mouseout ) ;  })*/
                ; 
            }

            if ( this.conf.chart.legend_values == true )
            {
                // console.info( this.conf.chart.id , $(this.conf.chart.id).width() ,  this.conf.chart.legend_translate.x - 35 ) ;
                this.map_legend
                    .append('text')
                    .attr('class','text_Legend')
                    .attr("x",  pointer_x + this.conf.chart.legend_space_after_rect )  // leave 5 pixel space after the <rect>
                    .attr("y", (d, i) => {
                       return pointer_y_rectangles - ( (i * this.conf.chart.legend_space_between_line) - this.conf.chart.legend_space_between_text )  ; // + (this.height - 200);
                    })
                    .attr('color', function(d){ return d;})
                    .style('font-size',this.conf.chart.legend_font_size)
                    // .attr("dy", "0.9em") // place text one line *below* the x,y point
                    .text( (d,i) => {
                        
                        // console.info( this.unique_values.length , colorset.length ) ; 
                        if ( this.unique_values.length == colorset.length ) 
                        {
                            return roundProportion( this.unique_values[i])+this.conf.chart.legend_suffix ; 
                        }
                        else
                        {
                            var extent = this.map_color.invertExtent(d) ;
                            //extent will be a two-element array, format it however you want:
                            var format = d3.format("0."+this.conf.chart.legend_decimal+"f") ;
                            if ( i == 0 && this.conf.chart.color_scale == 'quantile' && extent[1] != 0){
                                // console.info( " => ", extent ) ; 
                                return '< '+ roundProportion( extent[1] )+this.conf.chart.legend_suffix ; 
                            }
                            else if (i == (this.conf.chart.nb_colors-1) && this.conf.chart.color_scale == 'quantile' )
                                return '≥ ' + roundProportion(extent[0])+this.conf.chart.legend_suffix ; 
                            // specific to uv
                            else if ( extent[0] == 0 && extent[1] == 0 && this.conf.chart.color_scale == 'quantile')
                                return '= 0' ; 
                            else{
                                let left_val = ( int( extent[0] ) == 0 ) ? '> ' : '' ;  
                                return left_val + roundProportion(+extent[0]) + "–" + roundProportion(+extent[1])+this.conf.chart.legend_suffix;
                            }
                        }
                    })
                    .on("click", ( color_clicked ) => {
                        this.manageColorClicked( color_clicked ) ; 
                    })
                ;
            }
            if ( this.conf.chart.legend_title != '' )
            {
                this.group_legends
                    .append('text')
                    .attr('class','title_Legend')
                    .attr("x",  pointer_x )  // leave 5 pixel space after the <rect>
                    .attr("y", (d) => {
                       return pointer_y_rectangles - ( data_colors.length * this.conf.chart.legend_space_between_line )  ; 
                    })
                    .style('font-size', this.conf.chart.legend_font_size)
                    // .attr("dy", "0.9em") // place text one line *below* the x,y point
                    .text( this.conf.chart.legend_title ) ; 
            }
        }
    } , 

    /**
    * Zoom on a country (alias of zoom country)
    * @params (string) country code
    * @return (bool) return true 
    */ 
    zoomRegion : function ( codeCountry , translateObj , scale ){
        
        var focusedCountry = checkCountry( CanGraphMapFeatures , codeCountry );

        if ( focusedCountry == undefined )
        {
            var x = 0 ;
            var y = 0 ; 
            var k = 1 ;
            var stroke_width = 1 ; 

            if ( translateObj == undefined )
                var translate = "translate(0,0)" ; 
            else
                 var translate = "translate("+(translateObj.x)+","+(translateObj.y)+")" ; 
        }
        else
        {
            var centroid = this.map_path.centroid( focusedCountry ) ;
            var x = centroid[0] ;
            var y = centroid[1] + 20 ;
            var k = ( scale == undefined) ? 5 : scale ;
            var stroke_width = 1.5 / k ; 
            var centered = focusedCountry ;
            var translate = "translate(" + this.width / 2 + "," + this.height / 2 + ")" ; 
        }
        
        /* this.lines.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 
        
        this.poly.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 

        this.map_group.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", stroke_width + "px")
        ; */

        // console.info( " => on click continent " ,  translate , k  , x , y  ) ; 
        CanMapCurrentZoomInfos = translate + "scale(" + k + ")translate(" + -x + "," + -y + ")" ; 

        this.lines.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 
        
        this.poly.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 

        this.map_group.transition()
          .duration(this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", stroke_width + "px")
        ;

        //this.map_svg.call( CanGraphMapZoom ).call( CanGraphMapZoom.event ) ;

        if ( CanCircleGroup != undefined && CanCircleGroup != null)
            CanCircleGroup.transition()
                .duration(this.conf.chart.transition_duration)
                .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")")


        // 
        var bubbles_legend = d3.selectAll('#bubbles-legend') ; 

        if ( bubbles_legend[0] != 0 )
            bubbles_legend
                // .duration(this.conf.chart.transition_duration)
                .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 
    } , 

    setMapColor : function( key_color , dataset )
    {
        // CanGraphMapColor = null ; 
        // update color domaine
        // CanGraphMapColor.domain( d3.extent(d3.values(this.current_dataset.data), function(d) { return d[this.chart_key] ; }) );
        // var domain_values   = computeValuesForDomain( this.current_dataset.data ) ; 

        var domain_values = [] ; 
        var unique_values = [] ;  

        let _dataset = ( dataset != undefined ) ? dataset : this.conf.chart.data.src ; 

        // console.info( "=>", _dataset ); 
        for ( var item in _dataset ) 
        {
            if ( _dataset[ item ].no_data == true ) continue ; 
            var value = _dataset[ item ][ this.chart_key ] ; 
            domain_values.push( value ) ;

            if ( $.inArray( value , unique_values ) == -1 ) unique_values.push( value ) ; 
        }

        //domain_values = domain_values.sort(function(a, b) { return b - a; });
        // this.conf.chart.range_colors = this.conf.chart.range_colors ; 
        
        // CanMapGraphNbColors ; 

        // console.info( unique_values ) ; 
        if ( this.conf.chart.range_colors != undefined && this.conf.chart.range_colors.length > 0 )
        {
            range_colors = this.conf.chart.range_colors ; 
        }
        else if ( !colorbrewer[ key_color ] )
        {
            range_colors = CanColors.bootstrap_colors ; 
        }
        else
        {
            // if ( unique_values.length < CanMapGraphNbColors ) CanMapGraphNbColors = 3 ; 
            // console.info( this.conf.chart.nb_colors ) ; 
            range_colors  = Array.prototype.slice.call( colorbrewer[ key_color ][ this.conf.chart.nb_colors + 1 ] ) ;
            range_colors.shift();
        }
    
        // CanMapColorSet  = range_colors ; 
        this.colorset = range_colors ; 

        if ( range_colors == undefined ) return false ; 

        var range_radius = this.conf.chart.range_radius ; 

        // console.info( " in CanMapGraph " , d3.max( domain_values) , d3.max( unique_values ) ) ; 

        this.max_value = d3.max( domain_values) ; 
        var domain_ranges = [ d3.min( domain_values) , d3.max( domain_values) ]  ; 
        this.unique_values = unique_values.sort() ; 

        /// update color palette
        // console.log( this.conf.chart.color_scale ) ; 
        switch( this.conf.chart.color_scale )
        {
            case 'quantile' : 
                // console.info( "Range colors" , _dataset , range_colors , domain_values  ) ;
                this.map_color        = d3.scale.quantile().domain( domain_values ).range( range_colors );
                // CanGraphRadiusBubble    = d3.scale.sqrt().domain( domain_values ).range( range_radius );
                break ; 
            
            case 'quantize' : 
                this.map_color        = d3.scale.quantize().domain( domain_ranges ).range( range_colors );
                // CanGraphRadiusBubble    = d3.scale.sqrt().domain( domain_ranges ).range( range_radius );
                break ; 
        
        }

        // console.log( this.map_color , this.colorset ) ; 
        return this.map_color ; 
    }, 

    /**
    * Change the color of legend with the selectbox colobrewer list
    * @param (string) key of colorbrewer
    * @return (bool)
    */
    changeColorLegend : function( key_color )
    {   

        this.setMapColor( key_color ) ; 
        
        CanGraphMapFeatures.transition()  //select all the countries and prepare for a transition to new values
            .duration(this.conf.chart.transition_duration)  // give it a smooth time period for the transition
            .attr('fill', function(d) { 

                if ( CanGraphMapColor == undefined ) return ; 

                if ( d.properties.values.not_applicable == true || d.id == 'ESH' || d.properties.country == 'Abyei' || d.properties.country == Jammu ){
                    return Default.color_not_applicable ; 
                }

                if ( d.properties.values.no_data == true)
                    return Default.color_no_data ; 
                
                return CanGraphMapColor( d.properties.values[ this.chart_key ] == undefined ? d.properties.values.value : d.properties.values[ this.chart_key]  ) ; 
            });

        this.manageLegends();

        return true ; 
    } ,


    /**
    * Zoom on a country (alias of zoom country)
    * @params (string) country code
    * @return (bool) return true 
    */ 
    zoomRegion : function ( codeCountry , translateObj , scale ){
        
        var focusedCountry = this.checkCountry( this.map_features , codeCountry );

        if ( focusedCountry == undefined )
        {
            var x = 0 ;
            var y = 0 ; 
            var k = 1 ;
            var stroke_width = 1 ; 

            if ( translateObj == undefined )
                var translate = "translate(0,0)" ; 
            else
                 var translate = "translate("+(translateObj.x)+","+(translateObj.y)+")" ; 
        }
        else
        {
            var centroid = this.map_path.centroid( focusedCountry ) ;
            var x = centroid[0] ;
            var y = centroid[1] ;
            var k = ( scale == undefined) ? 1.5 : scale ;
            var stroke_width = 1.5 / k ; 
            var centered = focusedCountry ;
            var translate = "translate(" + this.width / 2 + "," + this.height / 2 + ")" ; 
        }
        
        // console.info( " => on click continent " ,  translate , k  , x , y  ) ; 
        CanMapCurrentZoomInfos = translate + "scale(" + k + ")translate(" + -x + "," + -y + ")" ; 

        /*this.lines.transition()
          .duration( this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; 
        
        this.poly.transition()
          .duration( this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")") ; */

        this.map_group.transition()
          .duration( this.conf.chart.transition_duration)
          .attr("transform", translate + "scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", stroke_width + "px")
        ;
    } ,

    /**
    * Find a geometry country with Geometries array and iso code 
    * @param (array) list of geometries countries
    * @param (string) iso code 
    */
    checkCountry : function (cnt, value) { 
        var found ; 
        /*cnt[0].filter( (d) => {
            if( d.id == "code_"+value ) { found = d ; return ; }
        });*/

        this.local_geometries.map( function(d ){
            if( d.properties.ISO_3_CODE == value ) { found = d ; return ; }
        }) ;

        return found ; 
    } , 


    /**
    * Grab all values from Geometries geojson + countries data + new dataset 
    * @param (array) data geometries from geojson
    * @param (array) data countries with all key (code, id, globocanid ... )
    * @param (array) new dataset from user search
    * @return (array)
    */
    grabValues : function( geometries ,countries , dataset_in ){
        
        //if ( this.countries == undefined ) return ; 
        // console.info( this.geometries ) ;
        this.local_geometries = ( this.conf.chart.hd == true ) ? this.geometries.features : this.geometries.objects['general'].geometries ; 

        // first init to 0
        for (var index = 0; index < this.countries.length; index++ ) {

            for( var geo in this.local_geometries )
            {
                if ( this.local_geometries[geo].id == this.countries[index].ISO_3_CODE ||
                    this.local_geometries[geo].iso_3_code == this.countries[index].ISO_3_CODE
                 )
                {
                    this.local_geometries[geo].properties = this.countries[index] ;
                    this.local_geometries[geo].properties.values = { 
                        'value' : 0 , 
                        'real_value' : 0 , 
                        'crude_rate' : 0 , 
                        'proportion' : 0 , 
                        'asr' : 0 , 
                        'cum_risk' : 0 ,
                        'cum0_74' : 0 ,
                        'no_data' : true 
                    } ;

                    for( var j in dataset_in ){

                        if ( //dataset_in[j].COUNTRY == this.countries[index].globocan_id 
                            dataset_in[j].country == this.countries[index].globocan_id 
                            || dataset_in[j].iso_3_code == this.countries[index].ISO_3_CODE
                            //||  dataset_in[j].globocan_id == Math.abs(this.countries[index].globocan_id )
                            //||  dataset_in[j].country_id == Math.abs(this.countries[index].globocan_id )
                        ) {

                            this.local_geometries[geo].properties.country_data = dataset_in[j].country_data ; 

                            var idCode = this.local_geometries[geo].properties.ISO_3_CODE ; 
                            // console.info( " =>" , idCode ) ; 

                            // console.info( dataset_in[j][this.conf.chart.key_data_value] , dataset_in[j] , this.conf.chart.key_data_value ) ; 
                            // console.info( dataset_in[j].value , dataset_in[j][this.conf.chart.key_data_value] ) ;
                            this.local_geometries[geo].properties.values = { 
                                'value' : ( dataset_in[j].value == undefined) ? dataset_in[j][this.conf.chart.key_data_value] : dataset_in[j].value , 
                                'real_value' : dataset_in[j].real_value , 
                                'crude_rate' : dataset_in[j].crude_rate , 
                                'proportion' : dataset_in[j].proportion , 
                                'cases' : dataset_in[j].total , 
                                'asr' : (dataset_in[j].asr) ? dataset_in[j].asr : 0 , 
                                'cum_risk' : dataset_in[j].cum_risk, 
                                'cum0_74' : ( dataset_in[j].cum0_74 != undefined) ? dataset_in[j].cum0_74 : null , 
                                'country_data' : ( dataset_in[j].country_data != undefined ) ? dataset_in[j].country_data : dataset_in[j] ,
                                'no_data' : "always" , //( dataset_in[j].no_data == undefined) ? false : dataset_in[j].no_data , 
                                'color' : ( dataset_in[j].color == undefined) ? undefined : dataset_in[j].color , 
                                'not_applicable' : ( dataset_in[j].not_applicable == undefined ) ? false : dataset_in[j].not_applicable , 
                                'grouping_color' : ( dataset_in[j].grouping_color == undefined ) ? false : dataset_in[j].grouping_color ,
                                'grouping_data' : ( dataset_in[j].grouping_data == undefined ) ? false : dataset_in[j].grouping_data ,
                            } ;

                            if ( this.local_geometries[index].properties.values == undefined ) continue ; 
                            if ( this.local_geometries[index].properties.values.country_data == undefined ) continue ;    

                            var b = this.local_geometries[index].properties.values.country_data.LABEL ; 

                            // continue ; 
                            break ; 
                        
                        } // end predictions 

                    } // end for
                } // match 
            } // end for - loop géometries
        } // end for - loop countries

        // console.log( this.geometries) ; 

        return this.local_geometries; 
    } , 

    /**
    * Change numbers or colors scale selectbox colobrewer list
    * @param (int) number of different colors (see the max per colorbrewer)
    * @param (string) key of colorbrewer
    * @return (bool)
    */
    changeNbScaleColors : function( nb_colors , key_color ){
        
        //CanMapGraphNbColors = nb_colors ; 
        this.conf.chart.nb_colors = nb_colors ;     
        this.conf.chart.key_color = key_color ; 

        // apply new color
        this.changeColorLegend( this.key_color ); 
        
        // refresh legend with new colors
        this.manageLegends();

        return true ; 

    } , 

    jumpToCountryGlobe : function( value ) {
    
        //if ( value == undefined || value == "GRL" || value == "ESH" ) return ; 

        if ( this.conf.chart.projection == 'globe' )
        {

            var rotate = this.map_projection.rotate(),
            focusedCountry = checkCountry( this.geometries , value );
            p = d3.geo.centroid( focusedCountry );

            currentGlobeCountryCode = value ; 

            if ( value != "" )
            {
                (function transition() {
                    d3.transition()
                        .duration( 3000 )
                        .tween("rotate", function() {
                            var r = d3.interpolate(this.map_projection.rotate(), [-p[0], -p[1]]);
                            return function(t) {
                                this.map_projection.rotate(r(t));
                                this.map_svg
                                    .selectAll(".country").attr("d", this.map_path)
                                    .classed("focused", function(d, i) { 
                                        if ( focusedCountry != undefined ) 
                                            return d.id == focusedCountry.id ? focused = d : false ;
                                        else
                                            return false ;   
                                    })
                                ;

                                this.poly.selectAll(".poly").attr("d", this.map_path);
                                this.lines.selectAll(".line").attr("d", this.map_path);


                                var pathCountry = 'path.country#code_'+currentGlobeCountryCode ; 
                                $(pathCountry).addClass('focused') ; 
                                // $(pathCountry).css('fill','rgb(30, 66, 115)') ; 
                            };

                        })
                    })
                ();
            }
        }
    } // end Jump > globe

}; // end class


