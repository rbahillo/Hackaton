var direction = 'right', speed = 100, ticker = null, fruitCell = [], score = 0, width = 40, height = 20;
		var snakeCells = [
			[ 10, 14, 1],
			[ 10, 13, 2],
			[ 10, 12, 3],
			[ 10, 11, 4],
			[ 10, 10, 4],
			[ 10, 9, 5]/*,
			[ 10, 8 ],
			[ 10, 7 ]*/
		];
		var snakeHead = [ 10, 14, 1 ];
		var snakeBack = [ 10, 10, 4 ];
		var snakeClassHead = '';
		var snakeClassBack = '';
		
		function renderSnake (){
			$('td').removeClass('snakeCell snakeHead snakeCellPassenger snakeHeadU snakeHeadD snakeHeadL snakeHeadR snakeBack snakeBackU snakeBackD snakeBackL snakeBackR');
			
			for (var cell in snakeCells ){
				//alert(snakeCells[0][1]);
				$('tr').eq(snakeCells[cell][0] ).find('td').eq(snakeCells[cell][1]).addClass('snakeCell');
			}
			//snakeCells[10,11].addClass('adultPassengers');
			
			$('tr').eq(snakeHead[0]).find('td').eq(snakeHead[1]).addClass(snakeClassHead);
			$('tr').eq(snakeBack[4]).find('td').eq(snakeBack[1]).addClass(snakeClassBack);
			$('tr').eq(snakeCells[1]).find('td').eq(snakeCells[2]).addClass('snakeCellPassenger');	
			//$('tr').eq( snakeCells[10][0]).find('td').eq(snakeCells[11][1]).addClass('adultPassenger');
			
		}

		function getFruitCell() {
			fruitCell = [ getRandomNumber( $( 'tr' ).length ), getRandomNumber( $( 'tr:eq(0)>td' ).length ) ];
		}

		function gameOver() {			
			var mi_variable= 'Puntuaci&oacute;n : ' + score + ' puntos';		
			scoreHtml.innerHTML = mi_variable;			
			puntuacion.style.display = "block";		    
			clearInterval( ticker );
		}


		function updateSnakeCell(){
			var snakeNewHead = [];
			var snakeNewBack = [];
			switch(direction){
				case 'right':
					snakeNewHead = [ snakeHead[0], snakeHead[1]+1 ];
					snakeNewBack = [ snakeBack[0], snakeBack[1]+1 ];
					snakeClassHead = 'snakeHeadR';
					snakeClassBack = 'snakeBackR';
					break;
				case 'left':
					snakeNewHead = [ snakeHead[0], snakeHead[1]-1 ];
					snakeNewBack = [ snakeBack[0], snakeBack[1]-1 ];
					snakeClassHead = 'snakeHeadL';
					snakeClassBack = 'snakeBackL';
					break;
				case 'up':
					snakeNewHead = [ snakeHead[0]-1, snakeHead[1] ];
					snakeNewBack = [ snakeBack[0]-1, snakeBack[1] ];
					snakeClassHead = 'snakeHeadU';
					snakeClassBack = 'snakeBackU';
					break;
				case 'down':
					snakeNewHead = [ snakeHead[0]+1, snakeHead[1] ];
					snakeNewBack = [ snakeBack[0]+1, snakeBack[1] ];
					snakeClassHead = 'snakeHeadD';
					snakeClassBack = 'snakeBackD';
					break;
			}
			var newCell = {length:0}
			if( snakeNewHead[0] < 0 || snakeNewHead[1] < 0 ) {
				gameOver();
				return;
			} else if( snakeNewHead[0] >= height || snakeNewHead[1] >= width ) {
				gameOver();
				return;
			}
			var newCell = $('tr').eq( snakeNewHead[0] ).find('td').eq(snakeNewHead[1]);
			if( newCell.length == 0 ) {
				gameOver();
			} else {
				if ( newCell.hasClass('snakeCell') ) {
					gameOver();
				} else {
					if( newCell.hasClass( 'fruitCell' ) || newCell.hasClass('adultPassenger') 
							|| newCell.hasClass('childPassenger') || newCell.hasClass('elderPassenger')) {
						snakeCells.push( [] );
						getFruitCell();
						renderFruitCell();
						score += 100;
						$( '#scoreBoard' ).html( 'Your Score : ' + score );
						speed = speed - 5 > 5 ? speed - 5 : speed;
						clearInterval( ticker );
						startGame();
					}
					for( var i = ( snakeCells.length - 1 ); i > 0 ; i-- ) {
						snakeCells[ i ] = snakeCells[ i - 1 ];
					}
					snakeCells[ 0 ] = snakeHead = snakeNewHead;
					renderSnake();
				}
			}
		}

		function getRandomNumber( limit ) {
			return parseInt( Math.random() * limit % limit );
		}

		function getNewDirection( keyCode ) {
			var codes = {
				37 : 'left',
				38 : 'up',
				39 : 'right',
				40 : 'down'
			};

			if( typeof codes[ keyCode ] != 'undefined' ) {
				var newDirection = codes[ keyCode ], changeDirection = true;
				switch( direction ) {
					case 'up' :
						changeDirection = newDirection != 'down';
						break;
					case 'down' :
						changeDirection = newDirection != 'up';
						break;
					case 'right' :
						changeDirection = newDirection != 'left';
						break;
					case 'left' :
						changeDirection = newDirection != 'right';
						break;
				}
				direction = changeDirection ? newDirection : direction;
			}
		}

		function renderBoard() {
			var rowhtml = '';
			for( var i = 0; i < width; i++ ) {
				rowhtml +='<td cellpadding="0" cellspacing="0"></td>'
			}
			html = [];
			for( var i = 0; i < height; i++ ) {
				html.push( '<tr cellpadding="0" cellspacing="0">' + rowhtml + '</tr>' );
			}
			$( document.body ).append( '<table>' + html.join( '\n' ) + '</table>' );
			getFruitCell();
		}
		
		function renderFruitCell() {
			$( 'td' ).removeClass( 'fruitCell' ).removeClass('adultPassenger').removeClass('childPassenger').removeClass('elderPassenger');
			var fruitPassenger = getRandomNumber( 4 );
			switch(fruitPassenger)
			{
			case 1:
			  var newFruitClass = 'adultPassenger';
			  break;
			case 2:
			  var newFruitClass = 'fruitCell'
			  break;
			case 3:
			  var newFruitClass = 'childPassenger';
			  break;
			case 4:
			  var newFruitClass = 'elderPassenger';
			  break;
			default:
			  var newFruitClass = 'fruitCell';	
			}
			
			
			$('tr').eq( fruitCell[0] ).find('td').eq(fruitCell[1]).addClass( newFruitClass );
			//$('tr').eq( fruitCell[0] ).find('td').eq(fruitCell[1]).addClass( 'passenger' );
			
		}

		function startGame() {
			ticker = setInterval( updateSnakeCell, speed );
		}
		
		function sendScore(){
			var myObject = new Object();
			
			myObject.alias = $('#alias').val();
			myObject.email = $('#email').val();
			myObject.score = score;
			
			var myString = JSON.stringify(myObject);
			
			
			$.ajax({
			    url: '/Send',
			    type: 'GET',
			    data: {'alias':$('#alias').val(), 'email':$('#email').val(),'score':score},
			    contentType: 'application/json',
			    dataType: 'json',
			    async: false,
			    success: function(data) {
			    	showData(data, myObject.email);
			    },
			    error: function(e) {
			    	//alert('Enviado ' + e[1].alias);
			    }
			});
			 
		}
		
		function showData(data, me){
			puntuacion.style.display = "none";	
			var pos = 1;
			var aux="";
			var myLine="";
			for (var key in data) {
				if(pos<=10){
				aux=aux+'<div id = "row">'
				aux=aux+'<div id="col1">'
				aux=aux+'<span>'+pos+'.</span>'
				aux=aux+'</div>'
				aux=aux+'<div id="col1">'
				aux=aux+'<span>'+data[key].alias+'</span>'
				aux=aux+'</div>'
				aux=aux+'<div id="col1">'
				aux=aux+'<span>'+data[key].best+'</span>'
				aux=aux+'</div>	'
				aux=aux+'</div>'
				}
				
				if(me==data[key].email){
					myLine=myLine+'<div id = "row">'
					myLine=myLine+'<div id="col1">'
					myLine=myLine+'<span> YOU '+pos+'.</span>'
					myLine=myLine+'</div>'
					myLine=myLine+'<div id="col1">'
					myLine=myLine+'<span>'+data[key].alias+'</span>'
					myLine=myLine+'</div>'
					myLine=myLine+'<div id="col1">'
					myLine=myLine+'<span>'+data[key].best+'</span>'
					myLine=myLine+'</div>'
					myLine=myLine+'</div>'
				}
				pos=parseInt(pos)+1
		    }
			
			totalScoreHtml.innerHTML = totalScoreHtml.innerHTML+aux+myLine;			
			totalScoreHtml.style.display = "block";
		}

		$( document ).ready(function(){
			renderBoard();
			renderFruitCell();
			$( document ).bind('keydown', function( e ) {
				getNewDirection( e.keyCode );
			});
			startGame();
		});