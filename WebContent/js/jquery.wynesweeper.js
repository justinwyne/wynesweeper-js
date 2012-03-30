/*
 * wynesweeper
 * 
 * Copyright (c) JustinWyne.com 2012
 * Version:
 * 		0.1
 * 
 * http://www.justinwyne.com
 * 
 */
(function( $ ) {
	
	$.fn.wynesweeper = function( options ) {

		var bombs, timer, score, menu,
			minefield,
			resetButton,
			cheatCounter = 0,
			gameOver = false,
			activeCells,
			defaults = {
                rows: 8,
                columns: 8,
                mines: 10
            };
		
        var o =  $.extend(defaults, options);
        
        /**
         * Initialize each object in the selector
         */
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
		
		/**
		 * Setup DOM
		 */
		function _buildFrame( ){
			minefield.addClass('wynesweeper');
			
			menu = new MineUtils.Menu( minefield );
			menu.element.appendTo( minefield );
			menu.resetButton.appendTo( minefield );
			menu.resetButton.click( _resetMinefield );
			
			$('<div class="clear"></div>').appendTo( minefield );
			
			statsBar = $('<div class="stats">' + o.columns + 'x' + o.rows + ' with ' + o.mines + ' mines</div>').appendTo( minefield );
			
			timer = new MineUtils.Timer();
			timer.reset().element.appendTo( minefield );
			
			score = new MineUtils.Score( o.mines );
			score.reset().element.appendTo( minefield ).click(_cheat);
			
			$('<div class="clear"></div>').appendTo( minefield );
			
			//Create rows
			var row = '<div class="minerow"></div>';
			for ( var i = 0; i < o.rows; i++){
				minefield.append( row );
			}
			
			//Fill rows with cells
			var cell = '<div class="cell"></div>';
			for ( var i = 0; i < o.columns; i++){
				minefield.find('.minerow').append( cell );
			}
			
			//Set click event binding
			minefield.find('.cell').mouseup( _clickCell );
		};
        
        function _generateBombs(){
        	bombs = $([]);
			var cellCount = o.rows * o.columns;
			var bombsIndices = new Array( o.mines );
			var x = 0;
			while ( x < o.mines ){
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
			if ( activeCells == o.mines ){
				_endGame( true );
			}
		}
		/**
		 * End game
		 * true = victory
		 * false = defeat
		 */
		function _endGame( victory ){
			timer.stop();
			gameOver = true;
			if ( victory ){
				bombs.each(function(){
					console.log("victory flag");
					_flagCell($(this), true);
				});
				menu.victory();
			} else {
				bombs.removeClass("flag").addClass("bomb").addClass("clean").html('<i class="icon-screenshot"></i>');
				menu.defeat();
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
		
		function _resetMinefield(){
			//Reset cells
			minefield.find(".cell").data('value',0).data('bomb',null).removeClass().addClass("cell active").html("");
			_generateBombs();
			_setCellData();
			timer.reset();
			score.reset();
			menu.newGame();
			gameOver = false;
			activeCells = o.rows * o.columns;
		}
		
		function _cheat(){
			if(++cheatCounter % 10 == 0)
				bombs.toggleClass("outline");
		}
		
		function _clickCell( event ){
			if ( gameOver ){ return; }
			
			var $this = $(this); 
			
			//Start timer if not started
			if ( !timer.started )
				timer.start();
			
			if ( !$this.hasClass('active') ){
				return;
			}
			
			//If right click
			if ( event.which == 3 ){
				_flagCell( $this );
				
			//If any other click
			} else {
				_flagCell( $this, false );
				$this.removeClass("active");
				
				if ( $this.data('bomb') == true ){
					$this.addClass("hit");
					_endGame( false );
				} else if ( $this.data('value') == 0 ){
					_expandEmpty( $this );
					activeCells--;
				} else {
					activeCells--;
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
				_getNeighbors(el).filter(".active").trigger('mouseup');
			}
		}
		
		/**
		 * Flag cell
		 * Optionally specify val to force enable/disable (true/false)
		 */
		function _flagCell( el, val ){
			var isFlagged = el.hasClass("flag");
			if ( val == true && isFlagged )
				return;
			if ( val == false && !isFlagged )
				return;
			
			if ( isFlagged )
				score.dec();
			else 
				score.inc();
			
			el.toggleClass("flag");
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
		

	};
	
})(jQuery);