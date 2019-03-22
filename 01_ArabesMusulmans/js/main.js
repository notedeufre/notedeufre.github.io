/**
 * Main application for "Champions cyclistes app"
 *
 * Comment postuler ? 
 * Plutôt qu’une sélection classique, nous vous proposons un exercice de sélection :
 *
 * A partir de données que vous irez récupérer sur le web, saurez-vous concevoir et réaliser un générateur capable de fournir, selon l’année de naissance du lecteur, le vainqueur du tour de france de cette année, le meilleur grimpeur et le meilleur sprinter ? L’objet créé devra être “responsive”, et hébergé sur un serveur dont vous nous communiquerez l’URL. 
 * Si cette offre vous intéresse, n’hésitez pas à nous contacter et à nous envoyer un CV et votre générateur de champions cyclistes, avant le 15 juillet, à l’adresse : lesdecodeursrecrutent@gmail.com
 *
 * @namespace EmberInspector/Shared
 * @class InPageScript
 */

var PROJECT = "arabs_muslims" ; 

var Default = {

	width : 1140 , 
	height : 1683 , 

	pie_items : 8 , 
	pie_margin : 65 , 

	color_no_data : '#f0f0f0' ,  
	color_not_applicable : '#7d7d7d' 

} ; 

(function($) {
  
  "use strict";
  
  if (!$) { return; }

  $(function() {
  	
  	var main_color = '#fabb00' ; 
  	var current_year = null ; 

  	

	var row = {} ; 
	var arabes = [] ; 

	// load data
	$.when(
		
		$.getJSON( "data/ligue-arabe.json" ) ,  
		$.getJSON( "data/muslims.json" ) ,
		$.getJSON( "data/countries.json" ) 

		).done( function( arabes , muslims , countries ) {

			for ( var a in arabes[0] )
			{
				$('ul.list-arabs').append('<li><span class="flag '+arabes[0][a].ISO2.toLowerCase()+'"></span><label>'+arabes[0][a].ISO+'</label></li>') ;
			}

			// calculate max
			// var max_distance = d3.max( arabes , function(d){ return d.distance ; }) ; 
			// var max_speed = d3.max( dataset , function(d){ return d.speed ; }) ; 
			// var max_step = d3.max( dataset , function(d){ return d.step ; }) ; 

			var pie2_width = $('#pie2').width() ; 
			var pie1_width = (460* pie2_width) / 1600 ;

			var chart1 = c3.generate({
				bindto : '#pie' , 
				size : { width : pie1_width } , 
			    data: {
			        columns: [
			        	['Musulmans', 435000000],
			            ['Chrétiens', 25000000],
			            ['Juifs', 1000000],
			        ],
			        type : 'pie'
			    } , 
			    label : { 
			    	show: false , 
			    	format: function (value, ratio, id) {
				      return d3.format('.2s')(value);
				    }
			    }
			});

			// 
			let country = undefined ; 
			var muslims_data = [] ; 
			let row = undefined ; 


			for ( var m in muslims[0] )
			{
				// find countries
				country = findCountryByLabel( muslims[0][m].label , countries[0] ) ;

				if ( country != undefined )
				{
					row = muslims[0][m] ; 
					row.muslim_population = toFloat(row.muslim_population) ; 
					row.percent_world = toFloat(row.percent_world) ; 
					row.percent = toFloat(row.percent) ; 
					
					row.country_info = country ; 

					muslims_data.push( row ) ; 
					// console.info( muslims[0][m].label , muslims[0][m] ) ; 
				}
			}

			let top_muslims = {
				pop : clone_array(muslims_data).sort( keysrt('muslim_population' ) ).slice(0,10) ,
				percent_world : clone_array(muslims_data).sort( keysrt('percent_world' ) )  ,
				percent : clone_array(muslims_data).sort( keysrt('percent' ) )  ,
			}

			let bars_data = [] ; 
			let pies_data = [] ; 
			let sum_muslim = 0 ; 
			for( var t in top_muslims.pop) 
			{
				bars_data.push([top_muslims.pop[t].label,top_muslims.pop[t].muslim_population]) ;  

				pies_data.push([top_muslims.pop[t].label,top_muslims.pop[t].muslim_population]) ; 
				sum_muslim += top_muslims.pop[t].muslim_population ; 
			}
			// rest of the world
			pies_data.push(['Reste du monde',1600000000-sum_muslim]) ; 

			var chart2 = c3.generate({
				bindto : '#bars' , 
			    data: {
			        columns: bars_data ,
			        type : 'bar'
			        // types: { data1 : 'bar'}
			    },
			    axis: { 
			    	//rotated: true , 
			    	x: {
			    		show: false , 
					    tick: {
					    	fit : true 
					      	// values: [0 , 500000 , 1000000 , 1500000 , 2000000 ]
					    }
					} 
			    }
			});

			var chart2 = c3.generate({
				bindto : '#pie2' , 
				size : { width : pie2_width } , 
			    data: {
			        columns: pies_data ,
			        type : 'pie'
			    }
			});

			var default_map_width = $('#map1').width();
			var default_map_height = 400 ; 
			var side_margin = 0 ; 

			// map 1 
			var dataviz_map1 = {
		      'type'      : 'map' ,
		      'title' 	  : false ,  
		      'width'     : default_map_width - side_margin - side_margin , // margin left right 
		      'height'    : default_map_height  , // 50 for the copyright 
		      'container' : '#map1',
		      'id'        : 'map1' , 
		      'data'      : {
		          'format' : 'json',
		          'src'    : []
		      },
		      'chart' : {
		          'scale' : 140 , 
		          'mode' : 'heat' , 
		          'key_data' : 'ISO_3_CODE',
		          'key_data_value' : 'asr' , 
		          'background' : 'transparent' , 
		          'colors' : 'PuBu' ,
		          'globe_translate' : { 'x' : -30 , 'y' : -80 } , 
		          'legend' : false , 
		          'legend_suffix' : '' , 
		          'legend_translate' : {
		            'x' : 20 , 
		            'y' : -15
		          },
		          'legend_title' : 'ASR (World) per 100 000' , 
		          'legend_last_value_y' : 50 , 
		          'projection' : 'natural-earth'  , 
		          'color_scale' : 'quantile' ,
		          'background_globe' : '#fff', 
		          'key_label_value' : 'Age-standardized rate (World)'
		      },
		      'copyright' : false , 
		      'downloads' : false 
		    } ;

		    var map_viz1 				= new CanChart( dataviz_map1 ).render() ;

		    // map 1 
			var dataviz_map2 = {
		      'type'      : 'map' ,
		      'title' 	  : false ,  
		      'width'     : default_map_width - side_margin - side_margin , // margin left right 
		      'height'    : default_map_height  , // 50 for the copyright 
		      'container' : '#map2',
		      'id'        : 'map2' , 
		      'data'      : {
		          'format' : 'json',
		          'src'    : []
		      },
		      'chart' : {
		          'scale' : 140 , 
		          'mode' : 'heat' , 
		          'key_data' : 'ISO_3_CODE',
		          'key_data_value' : 'asr' , 
		          'background' : 'transparent' , 
		          'colors' : 'PuBu' ,
		          'globe_translate' : { 'x' : -30 , 'y' : -80 } , 
		          'legend' : false , 
		          'legend_suffix' : '' , 
		          'legend_translate' : {
		            'x' : 20 , 
		            'y' : -15
		          },
		          'legend_title' : 'ASR (World) per 100 000' , 
		          'legend_last_value_y' : 50 , 
		          'projection' : 'natural-earth'  , 
		          'color_scale' : 'quantile' ,
		          'background_globe' : '#fff', 
		          'key_label_value' : 'Age-standardized rate (World)'
		      },
		      'copyright' : false , 
		      'downloads' : false 
		    } ;
		    var map_viz2 				= new CanChart( dataviz_map2 ).render() ;
	});

	


  }); // end func

}(window.jQuery)); // end func

