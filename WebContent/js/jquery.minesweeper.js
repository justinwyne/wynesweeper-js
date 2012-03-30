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
			var cheatCounter = 0;
			var minefield;
			var _intervalId;
			var timer;
			var resetButton;
			var elapsedTime = 0;
			var gameOver = false;
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
				var cellCount = options.rows * options.columns;
				var bombsIndices = new Array( options.bombs );
				var x = 0;
				while ( x < options.bombs ){
					index = Math.floor( Math.random() * (cellCount) );
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
			
			function _checkVictory(){
				if ( minefield.find(".cell").filter(".active").size() == options.bombs ){
					_endGame( true );
				}
			}
			function _endGame( victory ){
				_pauseTimer();
				gameOver = true;
				if ( victory ){
					//TODO: WIN alert
				} else {
					bombs.removeClass("flag").addClass("bomb").addClass("clean").html('<i class="icon-screenshot"></i>');
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
				minefield.addClass('minesweeper');
				timer = $('<div class="timer"></div>').appendTo( minefield );
				score = $('<div class="score">' + options.bombs + '</div>').appendTo( minefield ).click(_cheat);
				resetButton = $('<div class="reset">Reset</div>').appendTo( minefield );
				resetButton.click( _resetMinefield );
				statsBar = $('<div class="stats"></div>')
				
				
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
				minefield.find('.cell').mouseup( _clickCell );
			};
			
			function _resetMinefield(){
				//Reset cells
				minefield.find(".cell").data('value',0).data('bomb',null).removeClass().addClass("cell active").html("");
				_generateBombs();
				_setCellData();
				_resetTimer();
				gameOver = false;
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
			
			function _cheat(){
				if(++cheatCounter % 10 == 0)
					bombs.toggleClass("outline");
			}
			
			function _clickCell( event ){
				if ( gameOver ){ return; }
				
				var $this = $(this); 
				
				//Start timer if not started
				if ( !_intervalId ) { _intervalId = setInterval(_incrementTimer, 1000); }
				
				//If right click
				if ( event.which == 3 ){
					_flagCell( $this );
					
				//If any other click
				} else {
					// TODO: unflag _flagCell
					$this.removeClass("flag");
					$this.removeClass("active");
					
					if ( $this.data('bomb') == true ){
						$this.addClass("hit");
						_endGame( false );
					} else if ( $this.data('value') == 0 ){
						_expandEmpty( $this );
					} else {
						$this.addClass('clean');
						var val = $this.data("value");
						$this.addClass( "near" + val );
						$this.html( val );
					}
				}
				
				_checkVictory();
				
			}
			
			function _expandEmpty( el ) {
				if ( el.hasClass('clean') ){
					return;
				}
				
				if ( el.data("value") == 0 ){
					el.addClass('clean');
					_getNeighbors(el).trigger('mouseup');
				}
			}
			
			function _flagCell( el ){
				//determine actions
				if ( el.hasClass("flag") ){
					el.removeClass("flag");
					el.html("");
					//TODO: subtract mine from score
				} else if ( !el.hasClass("clean") ){
					el.addClass("flag");
					el.html("");
					//TODO: add to mine score
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
				
				_buildFrame();
				_resetMinefield();
				
				$this.data('loaded', true);
				
				//Disable right click context menu so that we can flag cells
				$this.bind("contextmenu", function(e){ return false; });
				
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