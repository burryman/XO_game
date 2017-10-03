var canvas = [];
var playerMark;
var compMark;
var turn;	 // 0 - игрок, 1 - компьютер

$(function(){
	initGame();

	$('td').on('click', function () {
		if(turn){
			if($(this).attr("data_mark_id") == "empty"){
				canvas[$(this).attr("data_row")][$(this).attr("data_col")] = playerMark;
				var icon = $(this).find('.' + playerMark + '_mark').eq(0);
				icon.show();
				$(this).attr("data_mark_id", playerMark);

				if(checkLanes(playerMark) || checkDiagonal(playerMark)){
					popUp("Игрок победил");
				}
				else{
					console.log(canvas);
					turn = false;
					compTurn();
				}
			}
		}
	});

	function compTurn(){
		var freeCells = getFreeCells();
		var winCells = canWin(compMark);
		var dangCells = canWin(playerMark);
		var cell;
		var findVal = ["1", "1"];
		var foundCell = findInArray(findVal, freeCells);

		if(freeCells.length > 0){
			if(winCells != false){
				cell = $("td[data_row = "+winCells[0]+"][data_col = "+winCells[1]+"]");
				canvas[winCells[0]][winCells[1]] = compMark;
			} else if (dangCells != false){
				cell = $("td[data_row = "+dangCells[0]+"][data_col = "+dangCells[1]+"]");
				canvas[dangCells[0]][dangCells[1]] = compMark;
			} else if(foundCell != false) {
				cell = $("td[data_row = "+foundCell[0]+"][data_col = "+foundCell[1]+"]");
				canvas[foundCell[0]][foundCell[1]] = compMark;
			} else {
				var randCell = freeCells[Math.floor(Math.random() * freeCells.length)];
				cell = $("td[data_row = "+randCell[0]+"][data_col = "+randCell[1]+"]");
				canvas[randCell[0]][randCell[1]] = compMark;
			}

			cell.attr("data_mark_id", compMark);
			var icon = cell.find('.' + compMark + '_mark').eq(0);
			icon.show();
			getFreeCells();

			if(checkLanes(compMark) || checkDiagonal(compMark)){
				popUp("Компьютер победил");
			}

			turn = true;
		}
	}

	function findInArray(val, arr){
		for (var i=0; i<arr.length; i++) {
			if((arr[i][0] == val[0]) && (arr[i][1] == val[1])){
				return arr[i];
			}
		}
		return false;
	}

	function canWin(mark){
		var mCount, mRowCount, mDiagCount = 0, mDiag2Count = 0;
		var dangCells = [];
		var dangDiagCell = [];
		var dangDiag2Cell = [];

		for (var col=0; col<3; col++) {
			mCount = 0;
			mRowCount = 0;

			var dangCell = [];
			var dangRowCell = [];

			if(canvas[col][col] == mark){
				mDiagCount++;
			} else if (canvas[col][col] == null) {
				dangDiagCell = [col, col];
			}

			if(mDiagCount > 1 && dangDiagCell.length > 0){
				dangCells.push(dangDiagCell);
			}

			if(canvas[3-col-1][col] == mark){
				mDiag2Count++;
			} else if (canvas[3-col-1][col] == null) {
				dangDiag2Cell = [3-col-1, col];
			}

			if(mDiag2Count > 1 && dangDiag2Cell.length > 0){
				dangCells.push(dangDiag2Cell);
			}

			for (var row=0; row<3; row++) {
				if (canvas[col][row] == mark) {
					mCount++;
				} else if (canvas[col][row] == null) {
					dangCell = [col, row];
				}

				if(canvas[row][col] == mark){
					mRowCount++;
				} else if (canvas[row][col] == null) {
					dangRowCell = [row, col];
				}

				if (mCount > 1 && dangCell.length > 0) {
					dangCells.push(dangCell);
				}

				if (mRowCount > 1 && dangRowCell.length > 0) {
					dangCells.push(dangRowCell);
				}
			}
		}
		if (dangCells.length > 0){
			console.log(dangCells);
			return dangCells[0];
		}
		else{
			return false;
		}
	}

	function popUp(mess){
		$.magnificPopup.open({
		    removalDelay: 500,
		    mainClass: 'my-mfp-zoom-in',
		    items: {
		      src: '<div id="small-dialog" class="zoom-anim-dialog">'+ mess +'</div>',
		      type: 'inline'
		    },
		    callbacks: {
				open: function() {

				},
				close: function() {
					initGame();
				}
		    }

		});
	}

	function checkDiagonal(mark) {
		var firstDiag, secDiag;
		firstDiag = true;
		secDiag = true;
		for (var i=0; i<3; i++) {
			firstDiag &= (canvas[i][i] == mark);
			secDiag &= (canvas[3-i-1][i] == mark);
		}

		if (firstDiag || secDiag) return true;

		return false;
	}

	function checkLanes(mark) {
		var cols, rows;
		for (var col=0; col<3; col++) {
			cols = true;
			rows = true;
			for (var row=0; row<3; row++) {
				cols &= (canvas[col][row] == mark);
				rows &= (canvas[row][col] == mark);
			}

			if (cols || rows) return true;
		}

		return false;
	}

	function getFreeCells(){
		var freeCells = [];

		$("td").each(function(cell){
			var curCell = [];
			if($(this).attr("data_mark_id") == "empty"){
				curCell = [$(this).attr('data_row'), $(this).attr('data_col')];
				freeCells.push(curCell);
			}
		});
		if(freeCells.length > 0){
			return freeCells;
		}
		else{
			popUp("Ничья");
		}
	}

	function initGame(){
		turn = Math.random() >= 0.5;

		$("tr").each(function(row){
			this.id = row;
			canvas[row] = [];

			$(this).children("td").each(function(col){
				$(this).addClass("cell");
				$(this).attr("data_row", row);
				$(this).attr("data_col", col);
				$(this).attr("data_mark_id", "empty");

				if($(this).children().length == 0){
					$('<img class = "x_mark" src="img/x.png" style="display: none;">').appendTo($(this));
					$('<img class = "o_mark" src="img/o.png" style="display: none;">').appendTo($(this));
				}
				else{
					$(this).children().each(function(){
						$(this).hide();
					});
				}

				canvas[row][col] = null;
			});
		});

		if(turn){
			playerMark = "x";
			compMark = "o";
		}
		else{
			playerMark = "o";
			compMark = "x";
			compTurn();
		}
	}
});



