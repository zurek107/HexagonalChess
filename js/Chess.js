function in_array(string, array) {
	for (i = 0; i < array.length; i++) {
		if(array[i] == string) {
			return true;
		}
	}
	return false;
}

function ImageObj() {
	this.x = false;
	this.y = false;
	this.width = false;
	this.height = false;
	this.src = false;
}

function Field(row, number, x, y, color) {
	
	this.row = row;
	this.number = number;
	this.x = x;
	this.y = y;
	this.color = color;
	this.piece = false;
	this.canvasElement = false;
	
	this.render = function(canvas, fieldSideLength) {
		var x = this.x;
		var y = this.y;
		var a = fieldSideLength;
		
		var d = 'M' + x + ' ' + y + ' L' + (x+a/2) + ' ' + (y-a*Math.sqrt(3)/2) + ' L' + (x+3*a/2) + ' ' + (y-a*Math.sqrt(3)/2) + ' L' + (x+2*a) + ' ' + y + ' L' + (x+3*a/2) + ' ' + (y+a*Math.sqrt(3)/2) + ' L' + (x+a/2) + ' ' + (y+a*Math.sqrt(3)/2) + ' L' + x + ' ' + y + ' Z';

		var canvasElement = canvas.path(d);
		canvasElement.id = this.row + this.number;
		canvasElement.attr('fill', this.color);
		canvasElement.attr('stroke', '#000000');
		
		canvasElement.hover(function() {
			canvasElement.attr('opacity', 0.9);
		}, function() {
			canvasElement.attr('opacity', 1.0);
		});
		
		this.canvasElement = canvasElement;
	}
	
	this.getRow = function() {
		return this.row;
	}
	
	this.getNumber = function() {
		return this.number;
	}
	
	this.getX = function() {
		return this.x;
	}
	
	this.getY = function() {
		return this.y;
	}
	
	this.getColor = function() {
		return this.color;
	}

}

function Board(width) {
	
	this.width = width;
	this.fieldSideLength = width/17;
	this.height = 11*this.fieldSideLength*Math.sqrt(3);
	this.fields = new Array();
	this.colors = new Array('#e2bc83', '#d7a253', '#ba812c'); //default colors	
	
	this.render = function(canvas) {
		var a = this.fieldSideLength;
		var fieldsInRow = 6;
		var rowsLetters = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l');
		
		var oppositeColorOrder = false;
		var colorNum = 0;
		var rowsCounter = 1;
			
		for(var i=0; i<11; i++) {		
			this.fields[rowsLetters[i]] = [];
			var x = i*3/2*a;

			if(i>=6) {
				fieldsInRow--;
				oppositeColorOrder = true;
			} else {
				fieldsInRow++;
			}
			
			switch(rowsCounter) {
				case 1:
					colorNum = (oppositeColorOrder) ? 1 : 2;
				break;
				case 2:
					colorNum = (oppositeColorOrder) ? 2 : 1;
				break;
				case 3:
					colorNum = (oppositeColorOrder) ? 0 : 0;
				break;
			}
			
			for(var j=1; j<fieldsInRow; j++) {
				
				switch(colorNum) {
					case 0:
						color = this.colors[0];
					break;
					case 1:
						color = this.colors[1];
					break;
					case 2:
						color = this.colors[2];
					break;				
				}
				
				var y =1/2*this.height+a*Math.sqrt(3)/2*(fieldsInRow) - j*a*Math.sqrt(3);
				this.fields[rowsLetters[i]][(i>5) ? j+i-5 : j] = new Field(rowsLetters[i], (i>5) ? j+i-5 : j, x, y, color);
				this.fields[rowsLetters[i]][(i>5) ? j+i-5 : j].render(canvas, a);	
				
				if(colorNum<=0) {
					colorNum = 2;
				} else {
					colorNum--;
				}
			}

			if(rowsCounter>=3) {
				rowsCounter = 1;
			} else {
				rowsCounter++;
			}
		}
		return true;
	}
	
	this.setColors = function(colors) {
		if(is_array(colors)) {
			this.colors = colors;
		}
	}

	this.getWidth = function() {
		return this.width;
	}
	
	this.getHeight = function() {
		return this.height;
	}
	
}

function Piece(row, number, board, player) {
	
	this.row = row;
	this.number = number;
	this.board = board;
	this.player = player;
	this.moves = new Array();
	this.image = new ImageObj();
	this.letter = false;
	this.canvasElement = false;
	this.rowsLetters = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l');
	
	var rowsLetters = this.rowsLetters;
	var currentRow = rowsLetters.indexOf(this.row);
		
	this.render = function(canvas, board) {
		var field = board.fields[row][number];
		var x = field.getX();
		var y = field.getY();
		
		if(this.image.src) {
			this.image.src += (this.player) ? ('_white.PNG') : ('_black.PNG');
			this.image.width = board.fieldSideLength;
			this.image.height = 50; //ToDo: scale in proportion to image width
			this.image.x = x + (board.fieldSideLength - this.image.width/2);
			this.image.y = y - 20;

			var canvasElement = canvas.image(this.image.src, this.image.x, this.image.y, this.image.width, this.image.height);
			
		} else {
			//render default piece representation
			x += board.fieldSideLength;
			
			var canvasElement = canvas.rect(x, y, 20);
			canvasElement.attr('fill', '#2e89ab');
			canvasElement.attr('stroke', '#000000');
		}
		
		this.canvasElement = canvasElement;
	}
	
	this.inBoard = function(row, number) {
		if(row>=0 && row<rowsLetters.length) {
			if(row>5) {
				if(number>(row-5) && number<=11)
					return true;
				else
					return false;		
			} else if(row<=5 && number<=6+row) {
				if(number>=1)
					return true;
				else 
					return false;
			}
		} else {
			return false;
		}
	}
	
	this.setMove = function(row, number) {
		this.moves[this.moves.length] = rowsLetters[row] + number;
	}
	
	this.setMoves = function(start, end, rowsSpace, numbersSpace) {
		var currentRow = rowsLetters.indexOf(this.row);
		
		for(var i=start; i<end; i++) {
			var fieldRow = currentRow + i*rowsSpace;
			var fieldNum = this.number + i*numbersSpace;
			if(this.inBoard(fieldRow, fieldNum)) {
				if(this.board.fields[rowsLetters[fieldRow]][fieldNum].piece != false) {
					if(this.board.fields[rowsLetters[fieldRow]][fieldNum].piece.player != this.player) {
						this.setMove(fieldRow, fieldNum);
					}
					break;
				} else {
					this.setMove(fieldRow, fieldNum);
				}
			}
		}
	}
	
	this.getRow = function() {
		return this.row;
	}
	
	this.getNumber = function() {
		return this.number;
	}
	
	this.setRow = function(row) {
		this.row = row;
	}
	
	this.setNumber = function(number) {
		this.number = number;
	}
	
	this.setPosition = function(row, number) {
		this.setRow(row);
		this.setNumber(number);
	}
	
}

function Game(board, pieces) {
	
	this.board = board;
	this.pieces= pieces;
	this.canvas = false;
	this.activePlayer = 1;
	this.activePiece = false;	
	this.isMove = false;
	this.isGameOver = false;

	this.init = function() {
		//init canvas
		console.log('Canvas init...');
		if(this.canvas = Raphael(0, 0, this.board.getWidth(), this.board.getHeight())) {
			console.log('Canvas initialized.');
		}

		//render board
		console.log('Rendering the board...');
		if(this.board.render(this.canvas)) {
			console.log('Board rendered.');
		}
		
		//render pieces
		console.log('Rendering the pieces...');
		for(var i=0; i<this.pieces.length; i++) {
			var piece = this.pieces[i];
			
			piece.render(this.canvas, board);	
			this.board.fields[piece.getRow()][piece.getNumber()].piece = piece;
		}
		console.log('Pieces rendered.');
	}
	
	this.run = function() {
		this.init();

		var self = this;
		
		for(var i in this.board.fields) {
			var row = this.board.fields[i];
			
			for(var j in row) {
				var fieldRow = row[j].getRow();
				var fieldNum = row[j].getNumber();
				
				row[j].canvasElement.click(
					function(self, fieldRow, fieldNum){ 
						return(function() {
							if(!self.isGameOver) {
								if(self.isMove) {
									if(in_array((fieldRow + fieldNum), self.activePiece.moves)) {
										//check if game over
										if(self.board.fields[fieldRow][fieldNum].piece.letter == 'K') {
											self.isGameOver = true;
											
											console.log('Game over!!!!');
											switch(self.activePlayer) {
												case 0:
													console.log('Black pieces win.');
												break;
												case 1:
													console.log('White pieces win.');
												break;
											}
										}
										//recolor
										self.recolor(self.activePiece.moves);
										//destroy if opposite piece on the target field
										self.destroy(fieldRow, fieldNum);
										//move
										self.move(fieldRow, fieldNum);
										//remove piece from previous field
										self.board.fields[self.activePiece.getRow()][self.activePiece.getNumber()].piece = false;
										//add piece to target field
										self.board.fields[fieldRow][fieldNum].piece = self.activePiece;
										//set piece position
										self.activePiece.setPosition(fieldRow, fieldNum);			
										self.isMove = false;
										
										if(!self.isGameOver) {
											//change player
											self.changePlayer();
											//log
											console.log(self.activePiece.letter + fieldRow + fieldNum);
										}
									} else {
										self.recolor(self.activePiece.moves);
										self.isMove = false;								
									}
								}
							}
						})
					}(self, fieldRow, fieldNum)
				);
			}
		}

		for(var i=0; i<this.pieces.length; i++) {
			var piece = this.pieces[i];
			
			piece.canvasElement.click(
				function(piece){ 
					return(function() {
						if(!self.isGameOver) {
							if(piece.player == self.activePlayer) {
								if(self.isMove) {
									//recolor if move
									self.recolor(self.activePiece.moves);
								}
								//set active piece
								self.activePiece = piece;		
								//set range
								self.activePiece.setRange(self.activePiece.getRow(), self.activePiece.getNumber());
								//display piece moves
								self.displayRange(piece.moves);
								self.isMove = true;
							} else {
								if(self.isMove) {
									//move and destroy
								}
							}
						}
					})
				}(piece)
			);
		}
	}
	
	this.move = function(fieldRow, fieldNum) {
		var field = this.board.fields[fieldRow][fieldNum];
		var x = field.getX() + (this.board.fieldSideLength - this.activePiece.image.width/2);
		var y = field.getY() - 20;
		
		this.activePiece.canvasElement.animate({'x' : x, 'y' : y}, 800);
	}
	
	this.destroy = function(pieceRow, pieceNumber) {
		var piece = this.board.fields[pieceRow][pieceNumber].piece
		if(piece != false) {
			piece.canvasElement
				.animate({
					'opacity' : 0
				}, 800, 'linear', function() {
					this.remove();
				});
		}
	}
	
	this.changePlayer = function() {
		if(this.activePlayer == 0)
			this.activePlayer = 1;
		else if(this.activePlayer == 1)
			this.activePlayer = 0;
	}
	
	this.displayRange = function(moves) {
		for(var i=0; i<moves.length; i++) {
			var field = this.canvas.getById(moves[i]);

			field.animate({
				'fill' : '#695a3a',
			}, 400);
		}
	}
	
	this.recolor = function(moves) {
		var fields = this.board.fields;
		
		//another solution? ideas??
		for(var i=0; i<moves.length; i++) {
			var row = moves[i].substr(0,1);
			var number = moves[i].substr(1,moves[i].length);
			var color = fields[row][number].getColor();
			
			this.canvas.getById(moves[i]).animate({'fill' : color}, 400);
		}
	}
	
}

function King() {

	Piece.apply(this, arguments);
	this.image.src = 'img/king';
	this.letter = 'K';

	this.setRange = function(row, number) {
		this.moves.length = 0;

		var currentRow = this.rowsLetters.indexOf(this.row);

		this.setMoves(1, 2, 2, 1);
		this.setMoves(1, 2, -2, -1);
		this.setMoves(1, 2, 0, 1);
		this.setMoves(1, 2, 0, -1);
		this.setMoves(1, 2, 1, 1);
		this.setMoves(1, 2, -1, 0);
		this.setMoves(1, 2, 1, 0);
		this.setMoves(1, 2, -1, -1);
		this.setMoves(1, 2, 1, -1);
		this.setMoves(1, 2, -1, -2);
		this.setMoves(1, 2, 1, 2);
		this.setMoves(1, 2, -1, 1);
	}	
	
}

function Knight() {

	Piece.apply(this, arguments);
	this.image.src = 'img/knight';
	this.letter = 'Kt';

	this.setRange = function(row, number) {
		this.moves.length = 0;

		var currentRow = this.rowsLetters.indexOf(this.row);

		this.setMoves(1, 2, -1, -3);
		this.setMoves(1, 2, -1, 2);
		this.setMoves(1, 2, -2, -3);
		this.setMoves(1, 2, -2, 1);
		this.setMoves(1, 2, -3, -2);
		this.setMoves(1, 2, -3,  -1);
		this.setMoves(1, 2, 1, 3);
		this.setMoves(1, 2, 1, -2);
		this.setMoves(1, 2, 2, 3);
		this.setMoves(1, 2, 2, -1);
		this.setMoves(1, 2, 3, 2);
		this.setMoves(1, 2, 3, 1);
	}	
	
}

function Bishop() {

	Piece.apply(this, arguments);
	this.image.src = 'img/bishop';
	this.letter = 'B';

	this.setRange= function(row, number) {
		this.moves.length = 0;

		var currentRow = this.rowsLetters.indexOf(this.row);

		this.setMoves(1, currentRow, -2, -1);
		this.setMoves(1, currentRow, -1, 1);
		this.setMoves(1, currentRow+1, -1, -2);
		this.setMoves(1, 11-currentRow, 2, 1);
		this.setMoves(1, 11-currentRow, 1, -1);
		this.setMoves(1, 11-currentRow, 1, 2);
	}	
	
}

function Rook() {
	
	Piece.apply(this, arguments);
	this.image.src = 'img/rook';
	this.letter = 'R';	

	this.setRange = function(row, number) {
		this.moves.length = 0;

		var currentRow = this.rowsLetters.indexOf(this.row);

		this.setMoves(1, currentRow+1, -1, 0);
		this.setMoves(1, currentRow+1, -1, -1);
		this.setMoves(1, 11-currentRow, 1, 0);
		this.setMoves(1, 11-currentRow, 1, 1);
		this.setMoves(1, this.number, 0, -1);
		this.setMoves(1, 11-this.number+1, 0, 1);
	}	
	
}

function Queen() {

	Piece.apply(this, arguments);
	this.image.src = 'img/queen';
	this.letter = 'Q';

	this.setRange = function(row, number) {
		this.moves.length = 0;

		var currentRow = this.rowsLetters.indexOf(this.row);

		this.setMoves(1, currentRow+1, -1, 0);
		this.setMoves(1, currentRow+1, -1, -1);
		this.setMoves(1, 11-currentRow, 1, 0);
		this.setMoves(1, 11-currentRow, 1, 1);
		this.setMoves(1, this.number, 0, -1);
		this.setMoves(1, 11-this.number+1, 0, 1);
		this.setMoves(1, currentRow, -2, -1);
		this.setMoves(1, currentRow, -1, 1);
		this.setMoves(1, currentRow+1, -1, -2);
		this.setMoves(1, 11-currentRow, 2, 1);
		this.setMoves(1, 11-currentRow, 1, -1);
		this.setMoves(1, 11-currentRow, 1, 2);
	}	
	
}

function Pawn() {

	Piece.apply(this, arguments);
	this.image.src = 'img/pawn';
	this.letter = 'P';

	this.setRange = function(row, number) {
		this.moves.length = 0;

		var rowsLetters = this.rowsLetters;
		var currentRow = rowsLetters.indexOf(this.row);

		if(this.player) {
			//eehh... pawn exception
			for(var i=1; i<=2; i++) {
				var fieldRow = currentRow;
				var fieldNum = this.number + i;
				
				if(this.inBoard(fieldRow, fieldNum)) {
					if(this.board.fields[rowsLetters[fieldRow]][fieldNum].piece == false) {
						this.setMove(fieldRow, fieldNum);
					} else {
						break;
					}
				}	
			}
			this.setMoves(1, 2, -1, 0);
			this.setMoves(1, 2, 1, 1);
		} else {
			//eehh... pawn another exception
			for(var i=1; i<=2; i++) {
				var fieldRow = currentRow;
				var fieldNum = this.number - i;
				
				if(this.inBoard(fieldRow, fieldNum)) {
					if(this.board.fields[rowsLetters[fieldRow]][fieldNum].piece == false) {
						this.setMove(fieldRow, fieldNum);
					} else {
						break;
					}
				}	
			}
			this.setMoves(1, 2, 1, 0);
			this.setMoves(1, 2, -1, -1);
		}

	}	
	
}