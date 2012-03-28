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
	
	var methods = {
		init : function(options) {
		
			//TODO: make sure all local vars are initialized with var
			//TODO: http://docs.jquery.com/Plugins/Authoring#Summary_and_Best_Practices
			var bombs;
			var minefield;
			var _intervalId;
			var timer;
			var resetButton;
			var elapsedTime = 0;
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
			
			function _endGame( victory ){
				if ( victory ){
					
				} else {
					bombs.addClass("bomb");
					_pauseTimer();
				}
			};
			
			function _getNeighbors( el ){
				var neighbors = $([]);
				var columnIndex = el.index();
				var above = el.parent().prev().find(".cell").eq( columnIndex );
				var below = el.parent().next().find(".cell").eq( columnIndex );
					
				neighbors = neighbors.add( above )
					.add( above.next() )
					.add( above.prev() )
					.add( el.next() )
					.add( el.prev() )
					.add( below )
					.add( below.next() )
					.add( below.prev() );
				
				return neighbors.filter('.cell');
			};
			
			//Function for setting up the initial DOM elements
			function _buildFrame( ){
				$('<div class="minefield"></div>').appendTo( minefield );
				
				//Create rows
				var row = '<div class="minerow"></div>';
				for ( var i = 0; i < options.rows; i++){
					minefield.append( row );
				}
				
				//Fill rows with cells
				var cell = '<div class="cell"></div>';
				for ( var i = 0; i < options.columns; i++){
					minefield.find('.minerow').append( cell );
				}
				
				//Set click event binding
				minefield.find('.cell').click( _clickCell );
			};
			
			function _resetMinefield(){
				//Reset cells
				minefield.find(".cell").data('value',0).data('bomb',null).removeClass().addClass("cell").html("");
				_generateBombs();
				_setCellData();
				_resetTimer();
			}
			
			function _pauseTimer(){
				_intervalId = window.clearInterval(_intervalId);
			}
			function _resetTimer(){
				_intervalId = window.clearInterval(_intervalId);
				elapsedTime = 0;
				timer.html( elapsedTime );
			}
			function _incrementTimer(){
				timer.html( ++elapsedTime );
			}
			
			function _clickCell(){
				var $this = $(this); 
				
				//Start timer if not started
				if ( !_intervalId )
					_intervalId = setInterval(_incrementTimer, 1000);
				
				if ( $this.data('bomb') == true ){
					_endGame( false );
				} else if ( $this.data('value') == 0 ){
					_expandEmpty( $this );
				} else {
					$this.addClass('clean');
					$this.html( $this.data("value") );
				}
				
				
			}
			
			function _expandEmpty( el ) {
				if ( el.hasClass('clean') ){
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
			
			return this.each(function() {
				var $this = $(this);
				minefield = $this;
				
				//if already initialized, reset minefield
				if ( $this.data('loaded') == true ){
					_resetMinefield();
					return;
				}
				
				$this.addClass('minesweeper');
				$this.append('<h3>Mine Sweeper</h3>');
				timer = $('<div class="timer"></div>').appendTo( $this );
				score = $('<div class="score">' + options.bombs + '</div>').appendTo( $this );
				resetButton = $('<div class="reset">Reset</div>').appendTo( $this );
				resetButton.click( _resetMinefield );
				
				_buildFrame();
				_resetMinefield();
				
				$this.data('loaded', true);
				minefield.bind("contextmenu", function(e){ return false; });
				//TODO:fix text selection
//				$('.board div').attr('unselectable','on').css('MozUserSelect','none');;
				
			});
		},
		
		reset : function() {
			// ...
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