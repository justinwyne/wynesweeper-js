if(	typeof( MineUtils ) == "undefined") MineUtils = {};

MineUtils.Timer = function() {
	this.value = 0;
	this.started = false;
	this.intervalid = null;
	this.element = $('<div class="timer"></div>');
	return this;
};
MineUtils.Timer.prototype.output = function(){
	this.element.html(this.value);
	return this;
};
MineUtils.Timer.prototype.inc = function( ){
	this.value++;
	this.output();
	return this;
};
MineUtils.Timer.prototype.start = function(){
	this.started = true;
	var instance = this;
	this.intervalid = setInterval( function(){instance.inc();}, 1000);
	return this;
};
MineUtils.Timer.prototype.reset = function(){
	this.started = false;
	this.value = 0;
	this.output();
	this.intervalid = window.clearInterval( this.intervalid );
	return this;
};
MineUtils.Timer.prototype.stop = function(){
	this.intervalid = window.clearInterval( this.intervalid );
	return this;
};



MineUtils.Score = function( mines ) {
	this.mines = mines;
	this.value = mines;
	this.element = $('<div class="score"></div>');
	return this;
};
MineUtils.Score.prototype.output = function(){
	this.element.html(this.value);
	return this;
};
MineUtils.Score.prototype.dec = function( ){
	this.value--;
	this.output();
	return this;
};
MineUtils.Score.prototype.inc = function( ){
	this.value++;
	this.output();
	return this;
};
MineUtils.Score.prototype.reset = function(){
	this.value = this.mines;
	this.output();
	return this;
};


MineUtils.Menu = function() {
	this.element = $('<div class="menu"></div>');
	this.resetButton = $('<div class="btn btn-small">Reset</div>');
	return this;
};
MineUtils.Menu.prototype.newGame = function(){
	this.element.html("");
	return this;
};
MineUtils.Menu.prototype.defeat = function( ){
	this.element.html("Defeat!");
	this.resetButton.fadeIn();
	return this;
};
MineUtils.Menu.prototype.victory = function( ){
	this.element.html("Victory!");
	this.resetButton.fadeIn();
	return this;
};
