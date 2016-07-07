/*
Array.prototype.shuffle = function(b){
	var i = this.length, j, t;
	while(i){
		j = Math.floor( ( i-- ) * Math.random() );
		t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};
*/

		
jQuery.preloadImages = function () {
	var images = (typeof arguments[0] == 'object') ? arguments[0] : arguments;
	for (var i = 0; i < images.length; i++) {
		jQuery("<img>").attr("src", images[i]);
	}
}

$.preloadImages(
	"./color0.png",
	"./color1.png",
	"./color2.png",
	"./colorl0.png",
	"./colorl1.png",
	"./colorl2.png"
);
	
var lang = {}
var prefix = 'en';

var levels = [];

var RED    = 0,
	GREEN  = 1,
	BLUE   = 2,
	YELLOW = 3;

var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
var SIZES = {
//	column : 0,
	pointsbar : 80,
	margin : 10,// без масштабирования
	lamp :  30,
	lampmargin : 45,
	
	levelbar : {
		x : 15,
		y : 25
	},
	colors : {
		y : {
			x : 145,
			y : 25
		},
		b : {
			x : 190,
			y : 25
		},
		r : {
			x : 237,
			y : 25
		},
		g : {
			x : 282,
			y : 25
		}
	}
}
var Game = {
	cursor : 0,
//	width      		: 5,//9 | 7
//	height     		: 5,//6 | 9
//	colnum			: 5,
//	lampnum			: 10,
//		points     		: 0,
//		objectsnum 		: 6,//6
//		level			: 1,
//	maxlevelsnum	: 9, // mappoints.length
//	up				: false,
//		start			: 0,
//		finish			: 0,
//		stepstime		: 5,//5, in sec.
//		run				: false,
//	map : [],
	_v  : false,
	net : {
//		fillvertices : function(i){
//			for(var j = 0; j < i; j++){
//				this.net.vertices[j] = {
//					x : 0,
//					y : 0,
//					glow : false,
//					color : (Math.random() * Game.colorsnum)|0
//				}
//			}
//		},
//		tiesM : [//                  0  1  2  3  4  5
//			[ 0, 0, 0, 0, 0, 0 ],// 0 [  , 0, 0, 0, 0, 0 ] (x > y) ? hasties(x, y) : hasties(y, x)
//			[ 0, 0, 0, 0, 0, 0 ],// 1 [  ,  , 0, 0, 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 2 [  ,  ,  , 0, 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 3 [  ,  ,  ,  , 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 4 [  ,  ,  ,  ,  , 0 ]
//			[ 0, 0, 0, 0, 0, 0 ]//  5 [  ,  ,  ,  ,  ,   ]
//		],
		ties : [], // (*)***(*) // (*)---( ) // ( )---(*) // ( )---( )
		vertices : [],
		patchcount : {}
	},
//	randcolors : function(){
//	},
/*
	hit : function(x, y){
		if(Game.debug_v){
			if(!Game.debug_vr){
				Game.net.vertices = [];
				Game.net.ties = [];
				Game.debug_vr = true;
			}
			$('#canvas').css('border', '1px solid #fff');
			if(Game.debug_va){} else {
				Game.debug_va = true;
				Game.net.vertices = []
				Game.net.ties = []
			}
			var icolor = ((Math.random() * 4)|0);
			console.log('{ x : ' + x + ', y : ' + y + ', glow : false, color : ' + icolor + ' },');
			Game.net.vertices.push({
				'x' : x,
				'y' : y,
				glow : true,
				colors : icolor
			});
			Game.draw();
		}
		for(i in this.net.vertices){
			var radius = Game.net.lampsize / 2 * SCALINGFACTOR;
			var _x = this.net.vertices[i].x * SCALINGFACTOR;
			var _y = this.net.vertices[i].y * SCALINGFACTOR - radius;
			var w = x - _x;
			var h = y - _y;
			w = (w > 0) ? w : (-w);
			h = (h > 0) ? h : (-h);
			var around = Math.sqrt((w*w)+(h*h));
			//console.log('_x ' + _x + ' _y ' + _y + ' w ' + w + ' h ' + h + ' around ' + around);
			if(radius >= around){
				return {
					index : i
				}
			}	
		}
		return false;
	},
*/	checkintersections : function() {
		var f = false;
		for(line1 in Game.net.ties) {
			var x1, y1, x2, y2; // первый отрезок
			var a = Game.net.ties[line1][0];
			var b = Game.net.ties[line1][1];
			x1 = Game.net.vertices[a].x;
			y1 = Game.net.vertices[a].y;
			x2 = Game.net.vertices[b].x;
			y2 = Game.net.vertices[b].y;
			//for(line1 in Game.net.ties) {
			for(line2 in Game.net.ties) {
				if(line1 != line2) {
					var c = Game.net.ties[line2][0];
					var d = Game.net.ties[line2][1];
					x3 = Game.net.vertices[c].x;
					y3 = Game.net.vertices[c].y;
					x4 = Game.net.vertices[d].x;
					y4 = Game.net.vertices[d].y;
					
					var A1 = y2 - y1; 
					var B1 = x1 - x2; 
					var C1 = - A1 * x1 - B1 * y1; 

					var A2 = y4 - y3; 
					var B2 = x3 - x4; 
					var C2 = -A2 * x3 - B2 * y3;

					var f1 = A1 * x3 + B1 * y3 + C1; 
					var f2 = A1 * x4 + B1 * y4 + C1; 
					var f3 = A2 * x1 + B2 * y1 + C2; 
					var f4 = A2 * x2 + B2 * y2 + C2;
					
					
					if(f1 * f2 < 0 && f3 * f4 < 0) {
						f = true;
						Game.net.ties[line1].intersection = true;
					} //else {
					//	Game.net.ties[line2].intersection = false;
					//}
				}
			}
			//}
		}
		Game.redrawties();
		for(i in Game.net.ties) {
			Game.net.ties[i].intersection = false;
		}
		if(!f) {
			Game.win();
		}
	},
	clearcanvas : function() {
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		ctx.clearRect (0, 0, GAMESPACE.X, GAMESPACE.Y);
	},
	redrawties : function() {
		//f = ( typeof(f) == 'undefined' )?false:f;
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		//ctx.fillStyle="#e5e5e5";
		//ctx.fillStyle="#ff0";
		ctx.lineWidth = 1;
		ctx.clearRect (0, 0, GAMESPACE.X, GAMESPACE.Y);
		ctx.clearRect (0, 0, 1000, 1000);
		//viewport.width = viewport.width;
		for(i in Game.net.ties){
			var index0 = Game.net.ties[i][0];
			var index1 = Game.net.ties[i][1];
			var a = Game.net.vertices[index0];
			var b = Game.net.vertices[index1];
			//console.log( i + ' ' + a.glow + ' ' + b.glow );
			ctx.beginPath();
			ctx.moveTo(a.x * SCALINGFACTOR, a.y * SCALINGFACTOR);
			//ctx.strokeStyle = "#138CCB";
			ctx.strokeStyle = (Game.net.ties[i].intersection)?"#f00":"#eee";
			//ctx.strokeStyle = (Game.net.ties[i].intersection)?"#ff0":"#138CCB";
			//Game.net.ties[i].intersection = false;
			ctx.lineTo(b.x * SCALINGFACTOR, b.y * SCALINGFACTOR);
			//ctx.lineWidth = 1;
			ctx.stroke();
		}
	},
	draw : function(){
		// debug create map
		//Game.net.vertices=[];Game.net.ties=[];$('#layer1').html('').bind('click', function(e){console.log('{ x : '+e.pageX+', y : '+(e.pageY-SIZES.pointsbar)+' },');Game.net.vertices.push({ x : e.pageX, y : e.pageY-SIZES.pointsbar });Game.draw();});
		
		//$('#layer1').unbind('click');
		
		//for(i in Game.net.vertices){console.log('{ x : ' + Game.net.vertices[i].x + ', y : ' + Game.net.vertices[i].y + '},');}
		
		//Game.net.ties=[];$('#layer1').delegate('.lamp', 'click', function(e){var _v=$(this).data().vertice;if(Game._v){if(Game._v==_v){return;}console.log('['+Game._v+', '+_v+'], ');Game.net.ties.push([parseInt(Game._v),parseInt(_v)]);Game._v=false;}else{Game._v=_v;}Game.draw();});Game.win=function(){};
		
		//this.checkintersections();
		//setTimeout(function(){
			Game.redrawties();
		//}, 100);

		$('#layer1').html('');
		for(i in this.net.vertices ){
			$('#layer1').append(
				$('<div>')
//				.attr('id', v + i);
				.data({vertice : i})
				.addClass('lamp')
				.css({
					'background-image' : ( 'url(\"vertice.png\")' ),
					left : ( this.net.vertices[i].x - (SIZES.lamp / 2) ) * SCALINGFACTOR,
					top : ( this.net.vertices[i].y - (SIZES.lamp / 2) ) * SCALINGFACTOR,
					width : SIZES.lamp * SCALINGFACTOR,
					height : SIZES.lamp * SCALINGFACTOR
			})
		);
		}
		$( ".lamp" ).draggable({
			containment: "#layer1",
			drag: function( e, ui ) {
				//console.log(e.pageX, e.pageY, e.clientX, e.clientY);
				var index = $(this).data('vertice');
				//Game.net.vertices[index].x = e.pageX - SIZES.margin;
				Game.net.vertices[index].x = $(this).position().left / SCALINGFACTOR + (SIZES.lamp / 2);
				Game.net.vertices[index].y = $(this).position().top / SCALINGFACTOR + (SIZES.lamp / 2);
				//Game.redrawties();
				Game.clearcanvas();
				Game.checkintersections();
				
			},
			stop : function() {
				//var index = $(this).data('vertice');
				
				//console.log(f?"yes":"not");
				
			}
		});		

	},
	drawmap : function() {
			$('#mapsplash').html('');
			//$('#mapsplash').append(' drawmap');
			for(i in levels){
				//draw point
				
				var l = $('<div>')
					.addClass('buttn')
					.html(parseInt(i) + 1);
//					.html(Game.levels[i].points);
				if(parseInt(localStorage['webgamelevel']) >= i) {$(l).addClass('inhistory');}
				$('#mapsplash').append(l);
				//$('#mapsplash').append(' button');
			}
			$('.inhistory').click(function(){
				$('#mapsplash').hide();
				$('#gamescreen').show();
				var index = $(this).index();
				//console.log('>>>', index);
				Game.startgame(index);
			});
		},
/*
	hascolor : function(i){
		switch(i){
			case RED :
				if(Game.net.patchcount.red > 0){
					Game.net.patchcount.red--;
					return true;
				}
				break;
			case GREEN :
				if(Game.net.patchcount.green > 0){
					Game.net.patchcount.green--;
					return true;
				}
				break;
			case BLUE :
				if(Game.net.patchcount.blue > 0){
					Game.net.patchcount.blue--;
					return true;
				}
				break;
			case YELLOW :
				if(Game.net.patchcount.yellow > 0){
					Game.net.patchcount.yellow--;
					return true;
				}
				break;
		}
		return false;
	},
*/
/*
	hasnextstep : function(){
		var colors = [0, 0, 0, 0];
		var colors2 = [];
			colors2[RED] = Game.net.patchcount.red;
			colors2[GREEN] = Game.net.patchcount.green;
			colors2[BLUE] = Game.net.patchcount.blue;
			colors2[YELLOW] = Game.net.patchcount.yellow;
		for(i in Game.net.ties){
			var i = Game.cursor;
			var a = Game.net.ties[i][0];
			var b = Game.net.ties[i][1];
			
			if(a == Game.cursor || b == Game.cursor){
				if(
					( Game.net.vertices[b].glow == false && Game.net.vertices[a].glow == true )
				) {
					colors[Game.net.vertices[b].color]++
				}
				if(
					( Game.net.vertices[a].glow == false && Game.net.vertices[b].glow == true )
				) {
					colors[Game.net.vertices[a].color]++
				}
			}
		}
		var p = 0;
		for(i in colors2){
			if(colors2[i] > 0 && colors[i] != 0){p++}
		}
		if(p > 0) {return true;}
		console.log('hasn\'t next step');
		return false;
	},
*/
	hasconnect : function(i){
		
		
		var c = parseInt(Game.cursor);
		for(j in this.net.ties){
			var a = this.net.ties[j][0];
			var b = this.net.ties[j][1];
			
			if(a == c || b == c){
				if(
					( a == i && this.net.vertices[b].glow === true ) ||
					( b == i && this.net.vertices[a].glow === true )
				){
					//console.log('connect ' + c + ' ' + i)
					return true;
				}
			}
		}
		return false;
	},
	checkwin : function(){
/*
		var r = 0, 
			g = 0, 
			b = 0;
		for(i in this.net.vertices){
			if(this.net.vertices[i].glow === true){
				if(this.net.vertices[i].color === RED){r++;}
				if(this.net.vertices[i].color === GREEN){g++;}
				if(this.net.vertices[i].color === BLUE){b++;}
			}
		}
		if( r === this.net.patchcount.red &&
			g === this.net.patchcount.green &&
			b === this.net.patchcount.blue){
			return true;
		}
*/
		if( this.net.patchcount.red === 0 &&
			this.net.patchcount.green === 0 &&
			this.net.patchcount.blue === 0)
			{return true;}
		return false;
	},
	gameover : function(){
		if(Game.debug_p || Game.debug_v || Game.debug_t){return;}
		$('#gameover').show();
		setTimeout(function(){
			$('#gameover').hide();
			//Game.startgame();
			document.location.reload();
		}, 3000);
	},
	win : function(){
		this.clearcanvas();
		if(this.debug_win) {return;}
		this.debug_win = true;
		if(Game.debug_p || Game.debug_v || Game.debug_t){return;}
		// TODO splash win
		$('#shadow').show();
		$('#youwin').show();
		console.log('you win');
		var l = parseInt(localStorage['webgamelevel']);
		if( l < levels.length - 1 && l == Game.level ){
			localStorage['webgamelevel'] = parseInt(localStorage['webgamelevel']) + 1;
		}
		setTimeout(function(){
			$('#shadow').hide();
			$('#youwin').hide();
			$('#gamescreen').hide();
			Game.drawmap();
			$('#mapsplash').show();//Game.startgame();
			//document.location.reload();
		}, 3000);
		//} else {
			//win all
		//}
		//$('#points').html(localStorage['box5points']);
		//Game.run = false;
	},
	startgame : function(index){
		this.debug_win = false;
		index = (typeof index != 'undefined')?index:parseInt(localStorage['webgamelevel']);
		Game.level = index;
		$('#level').html( index + 1 );
		//$('#level').html( (parseInt(localStorage['webgamelevel']) + 1) );
		
		//Game.net = levels[index];
		//this.net.vertices = [];
		//this.net.vertices = levels[index].vertices.slice();
		//this.net.vertices = levels[index].vertices.concat();
		//this.net.vertices = this.net.vertices.slice(0);
		this.net.vertices = [];
		for(i in levels[index].vertices) {
			Game.net.vertices.push({ 
				x : levels[index].vertices[i].x, 
				y : levels[index].vertices[i].y 
			});
		}
		this.net.ties = [];
		this.net.ties = levels[index].ties;
		//.concat(levels[index].vertices);
		//this.net.vertices = [];
		//for(i in levels[index].ties){this.net.ties.push(levels[index].ties[i])}
		//for(i in levels[index].vertices){this.net.vertices.push(levels[index].vertices[i])}
		this.colnum = ( 3 + ( parseInt(localStorage['webgamelevel']) / 3 )|0 );
		Game.width = Game.height = Game.colnum;
		//SIZES.column = GAMESPACE.X / Game.colnum;
//		SIZES.lamp = Game.net.lampsize;
		SIZES.lampmargin = Game.net.lampsize / 100 * 80;
		
		
		// TODO genmap()
		// or loadmap(level)
		// map -> vertices, ties, coordinates, glow, pathcount
		
		//this.randmap();
		
		setTimeout(function() {
			Game.draw();
		}, 300);
		//alert('draw end');
		
		//setTimeout(function(){
		//	Game.draw();
		//}, 300);
		/*
		this.startfinish();
		this.addbroken( parseInt(localStorage['plumbinglevel']) );//добавить разбитые
		this.draw();
		setTimeout(function(){
			Game.firststep();
		}, 0);
		*/
	},
	init : function(){
		if(
//			typeof(localStorage['webgamepoints']) === 'undefined' ||
			typeof(localStorage['webgamelevel']) === 'undefined'
		){
//			localStorage['webgamepoints'] = 0;
			localStorage['webgamelevel'] = 0;
		}
		$('#level').html(localStorage['webgamelevel']);
		//this.drawmap();
	}
}

$(document).ready(function(){
	Game.init();
	
	DWIDTH = document.body.clientWidth;
	DHEIGHT	= document.body.clientHeight;
	SCALINGFACTOR = DWIDTH / 320;
	BANNERHEIGHT = SCALINGFACTOR * 50;
	Game.width = Game.height = Game.colnum;
	//SIZES.column = ( DWIDTH  < 350 )?50:( DWIDTH < 750 )?70:100;
	GAMESPACE = {
		X : DWIDTH - ( SIZES.margin * 2 ),
		Y : DHEIGHT - BANNERHEIGHT - SIZES.pointsbar - ( SIZES.margin * 2 )
	}
//	SIZES.column = GAMESPACE.X / Game.colnum;
	$('#map').css({
//		width  : GAMESPACE.X,
//		height : GAMESPACE.Y,
		left   : SIZES.margin * SCALINGFACTOR
		
	});
	$('#canvas').attr('width', GAMESPACE.X)
				.attr('height', GAMESPACE.Y);
	$('#layer1').css({
		width : GAMESPACE.X,
		height : GAMESPACE.Y,
		left   : 0,
		top    : 0
	});
//				.css({
//					left : SIZES.margin,
//					top : SIZES.margin
//				});
	//$('#canvas').click(function(e){

				
	$('#youwin').css('width', (DWIDTH - 30 + 'px'));
	$('#gameover').css('width', (DWIDTH - 30 + 'px'));
	
	$('#pointsbar').css('height', (SIZES.pointsbar * SCALINGFACTOR + 'px'));
	//console.log(SIZES.levelbar.x);
	$('#levelbar').css({
		left : (SIZES.levelbar.x * SCALINGFACTOR + 'px'),
		top : (SIZES.levelbar.y * SCALINGFACTOR + 'px')
	});
/*
	$('#red').css({
		left : (SIZES.colors.r.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.r.y * SCALINGFACTOR + 'px')
	});
	$('#green').css({
		left : (SIZES.colors.g.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.g.y * SCALINGFACTOR + 'px')
	});
	$('#blue').css({
		left : (SIZES.colors.b.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.b.y * SCALINGFACTOR + 'px')
	});
	$('#yellow').css({
		left : (SIZES.colors.y.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.y.y * SCALINGFACTOR + 'px')
	});
*/
	$(document.body).css('background-size', (DWIDTH + 'px ' + DHEIGHT + 'px'));
	
	//Game.startgame();
	var _l, _t, _w, _h;
	_w = (202 * SCALINGFACTOR) + 'px';//548
	_h = (82 * SCALINGFACTOR);//247
	_l = (DWIDTH / 2 - 101 * SCALINGFACTOR) + 'px';
	_b = 200 / 1280 * DHEIGHT
	$('#playgame')
		.css({left:_l,bottom:(_b + 'px'),width:_w,height:_h + 'px'})
		.click(function(){
			$('#startscreen').hide();
			$('#mapsplash').show();
			Game.drawmap();
		});
/*	
	$(document).click(function(e){
		$('#debugbar').html('click');
		//console.log(e.pageX + ' ' + e.pageY);
		var l = Game.hit(
			( e.pageX - SIZES.margin ),
			( e.pageY - SIZES.margin - SIZES.pointsbar * SCALINGFACTOR )
		);
		if(l){
			//if(Game.net.patchcount <= 0 &&
			if(Game.debug_t){
				//console.log('debug_t');
				if(Game.debug_ti){
					console.log('[' + Game.debug_ti + ', ' + l.index + '],');
					Game.net.ties.push([Game.debug_ti, l.index]);
					Game.draw();
					Game.debug_ti = false
				} else{
					Game.debug_ti = l.index
				}
			}
			
			console.log('hit ' + l.index);
			$('#debugbar').html('hit');
			if(Game.net.vertices[l.index].glow == false) {
				if(Game.hasconnect(l.index)){// TODO с курсором
					//console.log('connect ok');
					
					if(Game.debug_p){
						Game.net.patchcount.red    = 7;
						Game.net.patchcount.green  = 7;
						Game.net.patchcount.blue   = 7;
						Game.net.patchcount.yellow = 7;
						if(!Game.debug_pr){Game.debug_pr = 0}
						if(Game.net.vertices[l.index].color == RED){Game.debug_pr++;}
						if(!Game.debug_pg){Game.debug_pg = 0}
						if(Game.net.vertices[l.index].color == GREEN){Game.debug_pg++;}
						if(!Game.debug_pb){Game.debug_pb = 0}
						if(Game.net.vertices[l.index].color == BLUE){Game.debug_pb++;}
						if(!Game.debug_py){Game.debug_py = 0}
						if(Game.net.vertices[l.index].color == YELLOW){Game.debug_py++;}
						Game.net.vertices[l.index].glow == true;
						Game.draw();
					}
				
					if( Game.hascolor(Game.net.vertices[l.index].color) ){
						//if( Game.hasnextstep() ) {
						Game.net.vertices[l.index].glow = true;
						//console.log(l.index + ' ' + (Game.net.vertices.length - 1));
						Game.cursor = l.index;
						if( l.index == (Game.net.vertices.length - 1) ){
							if(Game.checkwin()){
								Game.win();
							} else{
								Game.gameover();
							}
						} else if(Game.checkwin()){
							Game.gameover();
						} //else if( Game.hasnextstep() == false ){// TODO из курсора
						//	Game.gameover();
						//}
						//} else {
						//	Game.gameover();
						//}
					} else{
						Game.gameover()
						//console.log('такой цвет недоступен');
					}
				} else {
					//console.log('no connect');
				}
			}
			Game.draw();
			//TODO check patch 
			//change lamp
			//redraw all
			//console.log(l.index + ' ' + (Game.net.vertices.length - 1));
			
		} else{
			//console.log('miss');
		}
	});
*/
});