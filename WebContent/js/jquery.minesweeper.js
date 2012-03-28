/*
 * minesweeper
 * 
 * Copyright (c) JustinWyne.com 2012
 * Version:
 * 		0.1
 * 
 * http://www.justinwyne.com
 * 
 */
(function( $ ) {
	
	function _checkEndState(){
		
	};
	
	var methods = {
		init : function(options) {
		
			//TODO: add score
			//TODO: add timer
			//TODO: detect end game
			//TODO: restart game
			
			//TODO: create data model first, then apply to UI
			// don't make the UI the data model
			//TODO: make sure all local vars are initialized with var
			//TODO: http://docs.jquery.com/Plugins/Authoring#Summary_and_Best_Practices
			//TODO: remove dependency on "B" values all over
			var bombs;
			var minefield;
			var defaults = {
	                rows: 8,
	                columns: 8,
	                bombs: 3
	            };
			
			//TODO: Validate options
	                 
            var options =  $.extend(defaults, options);
            
            var cells = new Array(options.rows);
            for (var i = 0; i<options.rows; i++){
            	cells[i] = new Array(options.columns);
            }
			
            function _generateBombs(){
            	bombs = $([]);
            	//TODO: check for random indexing 0 or 1?
				var cellCount = options.rows * options.columns;
				var bombsIndices = new Array( options.bombs );
				var x = 0;
				while ( x < options.bombs ){
					index = Math.floor( Math.random() * (cellCount+1) );
					if ( $.inArray(index, bombsIndices) == -1  ){
						bombsIndices[x++] = index;
            		}
				}
				
				$.each(bombsIndices, function(index, value){
					var bomb = minefield.find('.cell').eq(value);
					bomb.data('bomb', true);
					bombs = bombs.add( bomb );
				});
				
			};
			
			function _revealBombs( ){
				//TODO: show which was hit
//				$.map(bombs, function(el, i){
//				    el.addClass("bomb");
//				});
				bombs.addClass("bomb");
			};
			
			function _getNeighbors( el ){
				var neighbors = $([]);
				var columnIndex = el.index();
				var rowAbove = el.parent().prev();
				var rowBelow = el.parent().next();
					
				neighbors = neighbors.add( rowAbove.find(".cell").eq(columnIndex) );
				neighbors = neighbors.add( rowAbove.find(".cell").eq(columnIndex).next() );
				neighbors = neighbors.add( rowAbove.find(".cell").eq(columnIndex).prev() );
				neighbors = neighbors.add( el.next() );
				neighbors = neighbors.add( el.prev() );
				neighbors = neighbors.add( rowBelow.find(".cell").eq(columnIndex) );
				neighbors = neighbors.add( rowBelow.find(".cell").eq(columnIndex).next() );
				neighbors = neighbors.add( rowBelow.find(".cell").eq(columnIndex).prev() );
				
				//TODO:filter for .cell
				return neighbors.filter('.cell');
			};
			
			//Function for setting up the initial DOM elements
			function _buildFrame( ){
				console.log("building frame");
				$('<div class="minefield"></div>').appendTo( minefield );
				
				var row = '<div class="minerow"></div>';
				
				for ( var i = 0; i < options.rows; i++){
					minefield.append( row );
				}
				
				var cell = '<div class="cell"></div>';
				
				for ( var i = 0; i < options.columns; i++){
					minefield.find('.minerow').append( cell );
				}
				
				minefield.find(".cell").data('value',0);
				
				//set binding
				minefield.find('.cell').click( _clickCell );
				
			};
			
			function _clickCell(){
				var $this = $(this); 
				
				if ( $this.data('bomb') == true ){
					_revealBombs();
				} else if ( $this.data('value') == 0 ){
					_expandEmpty( $this );
				} else {
					$this.addClass('clean');
					$this.html( $this.data("value") );
				}
				
			}
			
			function _getCellId(x, y){
				var index = options.columns*(y) + (x); 
				console.log( x+","+y + " --> i" + index);
				return index;
			};
			
			function _getCellCoords( index ){
				var x = index % options.columns;
				var y = Math.floor(index / options.columns);
				console.log( "i" + index + " --> " + x + ","+y);
				return {"x": x, "y": y};
			};
			
			function _expandEmpty( el ) {
				if ( el.is('.clean') ){
					return;
				}
				
				if ( el.data("value") == 0 ){
					el.addClass('clean');
					_getNeighbors(el).click();
				}
			}
			
			function _flagCell( object ){
				//determine actions
				if ( object.hasClass("flag") ){
					object.removeClass("flag");
				} else if ( !object.hasClass("clean") ){
					console.log("Flagged " + object.data("index") );
					object.addClass("flag");
				}
			};
			
			function _setCellData( ){
				bombs.each( function(){
					$this = $(this);
					_getNeighbors( $this ).each( function(){
						$(this).data('value',
								$(this).data('value') + 1
							);
					});
				});
			};
			
			function _incrementCellValue( context, x, y ){
				if ( x >= 0 && x < options.columns && y >= 0 && y < options.rows){
					console.log( "increment " + "x"+x+" y"+y + " [" + _getCellId(x, y) +"]");
					var index = _getCellId(x, y);
					var v = $("#cell"+index).data("value");
					if (v != "B"){
						$("#cell"+index).data("value", ++v);
					}
				}
			};
			
			return this.each(function() {
				var o = options;
				var $this = $(this);
				//check if already initialized, if so just stop
				if ( $this.data('loaded') == true ){
					console.log('not loading again');
					return;
				}
				
				minefield = $this;
				
				$this.addClass("minesweeper");
				$this.append("<h3>Mine Sweeper</h3>");
				$this.fadeIn('normal');
				
				_buildFrame();
				_generateBombs();
				_setCellData();
				
				console.log("loaded!");
				$this.data('loaded', true);
//				$('.board div').bind("contextmenu", function(e){ return false; });
				//TODO:fix text selection
//				$('.board div').attr('unselectable','on').css('MozUserSelect','none');;
				
			});
		},
		show : function() {
			// IS
		},
		hide : function() {
			// GOOD
		},
		update : function(content) {
			// !!!
		}
	};

	$.fn.minesweeper = function( method ) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}

	};
})(jQuery);