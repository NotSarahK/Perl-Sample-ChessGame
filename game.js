var currentLevel = new Array();

// secret king's paths
var LEVEL1PATH = [[1, 1],
				[2, 2],
				[1, 3],
				[2, 4]];

var LEVEL2PATH = [[2, 1],
				[1, 2],
				[2, 3],
				[2, 4],
				[2, 5],
				[2, 6],
				[2, 7]];

var LEVEL3PATH = [[1, 1],
				[2, 2],
				[3, 2],
				[4, 2],
				[4, 3],
				[4, 4]];

var LEVEL4PATH = [[3, 1],
				[2, 2],
				[3, 3],
				[2, 4],
				[3, 5],
				[3, 6],
				[4, 7]];

var messageNumber;

var level = 1;
var levelHeight;
var levelWidth;

// for making the chess board
var tile_colors = [0x000000, 0xFFFFFF];
var COLOR_BeadBorder = PS.COLOR_GRAY;

var COLOR_BoardLight = PS.COLOR_WHITE;
var COLOR_BoardDark = PS.COLOR_BLACK;

var moveKing;
var kingIndex;
var gameOver;

// numbers associated with pieces
var KING = 7;
var PAWN = 3;
var PAWN_MOVE = 4;
var BISHOP = 5;
var BISHOP_MOVE = 6;
var KNIGHT = 1;
var KNIGHT_MOVE = 2;

// clicks for moving pieces
var firstClick;
var piece;
var pieceX;
var pieceY;

function DrawLevel (levelNumber)
{   
	//level 1
    if (levelNumber == 1)
    {
		currentLevel = [
		[0,0,KING,0],
		[0,0,PAWN_MOVE,0],
		[0,0,PAWN,0],
		[0,PAWN_MOVE,0,0],
		[0,PAWN,0,0],
		];
   
    }
    //level 2
    if (levelNumber == 2)
    {		
		currentLevel = [
		[0,KING,0,0],
		[0,PAWN_MOVE,0,0],
		[0,PAWN,0,0],
		[0,0,0,BISHOP_MOVE],
		[0,0,BISHOP_MOVE,0],
		[0,BISHOP_MOVE,0,0],
		[BISHOP,0,0,0],
		[0,0,0,0],
		]; 
 
    }
    //level 3
    if (levelNumber == 3)
    {		
		currentLevel = [
		[0,KING,0,0,0,0],
		[0,0,0,PAWN_MOVE,0,0],
		[0,0,KNIGHT_MOVE,PAWN,KNIGHT_MOVE,0],
		[0,KNIGHT_MOVE,0,0,0,KNIGHT_MOVE],
		[0,0,0,KNIGHT,0,0],
		];
    
    }
    //level 4
    if (levelNumber == 4)
    {		
		currentLevel = [
		[0,0,0,0,KING,0],
		[0,0,PAWN_MOVE,0,0,BISHOP],
		[0,0,PAWN,0,BISHOP_MOVE,0],
		[0,0,0,BISHOP_MOVE,0,0],
		[0,0,BISHOP_MOVE,0,0,0],
		[0,BISHOP_MOVE,KNIGHT_MOVE,0,KNIGHT_MOVE,0],
		[BISHOP_MOVE,KNIGHT_MOVE,0,0,0,KNIGHT_MOVE],
		[0,0,0,KNIGHT,0,0],
		];
  
    }
    
    //starting important variables
    levelHeight = currentLevel.length;
	levelWidth = currentLevel[0].length;
	PS.GridSize(levelWidth, levelHeight);
	PS.BeadBorderWidth( PS.ALL, PS.ALL, 1);
    PS.StatusColor (PS.COLOR_BLACK);
	PS.StatusText ("God Save the King\u2654");
	PS.BeadFlash(PS.ALL, PS.ALL, false);
	PS.BeadBorderWidth(PS.ALL, PS.ALL, 1);

	//loop for each row and column to make the board
	for (var y = 0; y < levelHeight; y++)
	{
		for(var x = 0; x < levelWidth; x++)
		{
			DrawLevelBead(x, y, currentLevel[y][x]);
			
			PS.BeadData(x, y, currentLevel[y][x]);
			PS.BeadBorderColor(x,y,COLOR_BeadBorder);
			//this will help create the chess board
			if( (x + y) % 2 == 0)
			{
				PS.BeadColor(x,y,COLOR_BoardLight);
			}
			else
			{
				PS.BeadColor(x,y,COLOR_BoardDark);
			}
		}
	}
	
	//variables to reset on reload
	firstClick = true;
	moveKing = false;
	gameOver = false;
};


function DrawLevelBead(x, y, data)
{
	//Setting the style to Default
	PS.BeadBorderWidth(x, y, 0);
	PS.BeadGlyph(x, y, " ");
	PS.BeadData(x, y, data);
	
	//checking bead and data
	if (data == 0) //empty space
	{
		PS.BeadColor(x , y, 0xEFEFFE);
	}
	else if (data == KNIGHT) //Red Knight
	{
		PS.BeadGlyph(x, y, "\u265E");
		PS.BeadGlyphColor(x, y, PS.COLOR_RED);
	}
	else if (data == KNIGHT_MOVE) //Red knight's path - light red
	{
		PS.BeadGlyph(x, y, "\u2658");
		PS.BeadGlyphColor(x, y, 0xFFA4A4);
	}
	else if (data == PAWN) //Red Pawn
	{
		PS.BeadGlyph(x, y, "\u265F");
		PS.BeadGlyphColor(x, y, PS.COLOR_RED);
	}
	else if (data == PAWN_MOVE) //light pawn path
	{
		PS.BeadGlyph(x, y, "\u2659");
		PS.BeadGlyphColor(x, y, 0xFFA4A4);
	}
	else if (data == BISHOP) //bishop
	{
		PS.BeadGlyph(x, y, "\u265D");
		PS.BeadGlyphColor(x, y, PS.COLOR_RED);
	}
	else if (data == BISHOP_MOVE) // light bishop path
	{
		PS.BeadGlyph(x, y, "\u2657");
		PS.BeadGlyphColor(x, y, 0xFFA4A4);
	}
	else if (data == KING) // The King
	{
		PS.BeadGlyph(x, y, "\u2654");
		PS.BeadGlyphColor(x, y, PS.COLOR_BLUE);
	}	
};

PS.Init = function ()
{
	"use strict";

	messageNumber = 1;
		
	//load audio files
	//sound for a mistake
	PS.AudioLoad("fx_hoot");
	//winning the level
	PS.AudioLoad("fx_tada");
	
	PS.Clock(180);
 //every 60 ticks = 1 second

	//by default starts with level 1
	DrawLevel(level);    
};


PS.Click = function (x, y, data, options)
{
	"use strict";
	
	// if game isn't over and the king isn't in the move phase, make pieces movable
	if (gameOver != true && moveKing != true) {
		// making the first click
		if (firstClick) {
//			PS.Debug("First click\n");
//			PS.Debug("Piece: " + data + "\n");
			piece = data;
			pieceX = x;
			pieceY = y;
			//highlight the clicked space
			PS.BeadBorderWidth(x, y, 5);
			PS.BeadBorderColor(x, y, PS.COLOR_YELLOW);
			firstClick = false;
		}
		// checking if the second click can move a piece
		else {
			//for valid moves, move the piece
			if (piece == PAWN)
			{
//				PS.Debug("Pawn\n");
				if (data == PAWN_MOVE) {
					DrawLevelBead(x, y, PAWN);
					DrawLevelBead(pieceX, pieceY, 0);
				}
			}
			else if (piece == BISHOP)
			{
//				PS.Debug("Bishop\n");
				if (currentLevel[y][x] == BISHOP_MOVE) {
					DrawLevelBead(x, y, BISHOP);
					DrawLevelBead(pieceX, pieceY, 0);
				}
			}
			else if (piece == KNIGHT)
			{
//				PS.Debug("Knight\n");
				if (currentLevel[y][x] == KNIGHT_MOVE) {
					DrawLevelBead(x, y, KNIGHT);	
					DrawLevelBead(pieceX, pieceY, 0);		
				}
			}
			// if not a valid move, do nothing
			PS.BeadBorderWidth(pieceX, pieceY, 0); //removes the highlight
			firstClick = true;
			kingIndex = 0;
		}
	}
};


PS.Release = function (x, y, data, options)
{
	"use strict";
	// Put code here for when the mouse button is released over a bead	
};

PS.Enter = function (x, y, data, options)
{
	"use strict";
	// Put code here for when the mouse enters a bead	
};

PS.Leave = function (x, y, data, options)
{
	"use strict";	
	// Put code here for when the mouse leaves a bead	
};


PS.KeyDown = function (key, shift, ctrl, options)
{
	"use strict";

	//space bar to start king's movement
	if(key == 32)
	{
		if (moveKing == false)
		{
			moveKing = true;
		}
		else if (kingIndex == LEVEL1PATH.length)
		{
			level++;
		}
	}
	//level 1
	else if (key == 49)
	{
		level = 1;
		DrawLevel(1);
	}
	//level 2
	else if (key == 50)
	{
		level = 2;
		DrawLevel(2);
	}
	//level 3
	else if (key == 51)
	{
		level = 3;
		DrawLevel(3);
	}
	//level 4
	else if (key == 52)
	{
		level = 4;
		DrawLevel(4);
	}
};


PS.KeyUp = function (key, shift, ctrl, options)
{
	"use strict";	
	// Put code here for when a key is released	
};

PS.Wheel = function (dir, options)
{
	"use strict";
	// Put code here for when mouse wheel is moved
};


PS.Tick = function (options)
{
	"use strict";
	
	//messages for each tick
	
	if (messageNumber == 1) 
	{
		PS.StatusText ("Help the King on a safe path");
		PS.StatusColor (PS.COLOR_BLACK);
	}
	if (messageNumber == 2) 
	{
		PS.StatusText ("Move the solid pieces by clicking");
	}
	if (messageNumber == 3) 
	{
		PS.StatusText ("on them and then");
	}
	if (messageNumber == 4)
	{
		PS.StatusText ("clicking on an outlined piece.");
	}
	if (messageNumber == 5)
	{
		PS.StatusText ("The King \u2654 has a secret");
	}
	if (messageNumber == 6)
	{
		PS.StatusText ("predetermined path.");
	}
	if (messageNumber == 7) 
	{
		PS.StatusText ("Once you have moved the pieces");
	}
	if (messageNumber == 8) 
	{
		PS.StatusText ("press the space bar.");
	}
	if (messageNumber == 9)
	{
		PS.StatusText ("The King's will then move");
	}
	if (messageNumber == 10)
	{
		PS.StatusText ("along his path.");
	}
	if (messageNumber == 11) 
	{
		PS.StatusText ("God Save the King\u2654");
		PS.StatusColor (PS.COLOR_BLUE);
	}
	messageNumber++;
	
	// move king phase
	// if king can move (spacebar hit) and game isn't over, animate king's movement
	if (moveKing == true && gameOver != true) 
	{
		if (level == 1) 
		{
			if (kingIndex < LEVEL1PATH.length) 
			{
//				PS.Debug("king moved.\n");
//				PS.Debug("X: " + LEVEL1PATH[kingIndex][0] + ", " + LEVEL1PATH[kingIndex][1] + "\n");
				isOccupied(LEVEL1PATH[kingIndex][0], LEVEL1PATH[kingIndex][1]);
			}
			kingIndex++;
			if (kingIndex == LEVEL1PATH.length) {
				PS.AudioPlay( "fx_tada" );
				PS.StatusText ("\u2654 KING SAVED! Press " + (level+1) + " for the next level.");
				messageNumber = 12;
			}
		}
		if (level == 2) 
		{
			if (kingIndex < LEVEL2PATH.length)
			{
//				PS.Debug("king moved.\n");
//				PS.Debug("X: " + LEVEL2PATH[kingIndex][0] + ", " + LEVEL2PATH[kingIndex][1] + "\n");
				isOccupied(LEVEL2PATH[kingIndex][0], LEVEL2PATH[kingIndex][1]);
			}
			kingIndex++;		
			if (kingIndex == LEVEL2PATH.length) {
				PS.AudioPlay( "fx_tada" );
				PS.StatusText ("\u2654 KING SAVED! Press " + (level+1) + " for the next level.");
				messageNumber = 12;
			}
		}
		if (level == 3) 
		{
			if (kingIndex < LEVEL3PATH.length)
			{
//				PS.Debug("king moved.\n");
//				PS.Debug("X: " + LEVEL3PATH[kingIndex][0] + ", " + LEVEL3PATH[kingIndex][1] + "\n");
				isOccupied(LEVEL3PATH[kingIndex][0], LEVEL3PATH[kingIndex][1]);
			}
			kingIndex++;
			if (kingIndex == LEVEL3PATH.length) {
				PS.AudioPlay( "fx_tada" );
				PS.StatusText ("\u2654 KING SAVED! Press " + (level+1) + " for the next level.");
				messageNumber = 12;
			}
		}
		if (level == 4) 
		{
			if (kingIndex < LEVEL4PATH.length)
			{
//				PS.Debug("king moved.\n");
//				PS.Debug("X: " + LEVEL4PATH[kingIndex][0] + ", " + LEVEL4PATH[kingIndex][1] + "\n");
				isOccupied(LEVEL4PATH[kingIndex][0], LEVEL4PATH[kingIndex][1]);
			}
			kingIndex++;
			if (kingIndex == LEVEL4PATH.length) {
				PS.AudioPlay( "fx_tada" );
				PS.StatusText ("\u2654 KING SAVED! YOU WON!");
				messageNumber = 12;
			}
		}
	}
};

// checks if the given space on the board is occupied or not		
function isOccupied(x, y)
{
	// if the space is not empty or not a piece highlight bead, the king will die
	if (PS.BeadData (x, y) != 0 && PS.BeadData (x, y) != PAWN_MOVE &&
		PS.BeadData(x, y) != BISHOP_MOVE && PS.BeadData(x, y) != KNIGHT_MOVE)
	{
//		PS.Debug("Hit!! X: " + x + ", Y: " + y + "\n");
 		messageNumber = 12;
 		if (PS.BeadData(x, y) == PAWN) {
		 	PS.StatusText ("\u265F killed the king! Press " + level + " to reset.");
		 	PS.StatusColor (PS.COLOR_RED);
		 	//highlight the clicked space
			PS.BeadBorderWidth(x, y, 5);
			PS.BeadBorderColor(x, y, PS.COLOR_RED);
		}
		else if (PS.BeadData(x, y) == KNIGHT) {
		 	PS.StatusText ("\u265E killed the king! Press " + level + " to reset.");
		 	PS.StatusColor (PS.COLOR_RED);
		 	//highlight the clicked space
			PS.BeadBorderWidth(x, y, 5);
			PS.BeadBorderColor(x, y, PS.COLOR_RED);
		}
 		else if (PS.BeadData(x, y) == BISHOP) {
		 	PS.StatusText ("\u265D killed the king! Press " + level + " to reset.");
		 	PS.StatusColor (PS.COLOR_RED);
		 	//highlight the clicked space
			PS.BeadBorderWidth(x, y, 5);
			PS.BeadBorderColor(x, y, PS.COLOR_RED);
		}
		PS.AudioPlay( "fx_hoot" );
 		gameOver = true;
	}
	// open space or highlight bead, so king can move
	else
	{
		PS.StatusText("\u2654 King moving...");
		PS.BeadGlyph(x, y, "\u2654");
		PS.BeadGlyphColor(x, y, PS.COLOR_BLUE);
// 		DrawLevelBead(x, y, KING);
 	}
};

