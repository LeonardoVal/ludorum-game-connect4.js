require(['require-config'], function (init) { "use strict";
init(['creatartis-base', 'sermat', 'ludorum', 'playtester', 'ludorum-game-connect4'],
	function (base, Sermat, ludorum, PlayTesterApp, ludorum_game_connect4) {

	var BasicHTMLInterface = ludorum.players.UserInterface.BasicHTMLInterface;

	/** Custom HTML interface for Connect4.
	*/
	var ConnectFourHTMLInterface = base.declare(BasicHTMLInterface, {
		constructor: function ConnectFourHTMLInterface() {
			BasicHTMLInterface.call(this, {
				document: document,
				container: document.getElementById('board')
			});
		},

		/** Each of the board's squares looks are customized via CSS.
		*/
		classNames: {
			'0': "ludorum-square-player0",
			'1': "ludorum-square-player1",
			'.': "ludorum-square-empty"
		},

		/** This is a mapping from the board to HTML for each of the board's squares.
		*/
		squareHTML: {
			'0': "&#x25CF;",
			'1': "&#x25CF;",
			'.': "&nbsp;"
		},

		display: function display(game) {
			this.container.innerHTML = ''; // empty the board's DOM.
			var ui = this,
				moves = game.moves(),
				activePlayer = game.activePlayer(),
				board = game.board,
				classNames = this.classNames,
				squareHTML = this.squareHTML;
			moves = moves && moves[activePlayer];
			var table = game.board.renderAsHTMLTable(this.document, this.container, function (data) {
					data.className = classNames[data.square];
					data.innerHTML = squareHTML[data.square];
					if (moves && moves.indexOf(data.coord[1]) >= 0) {
						data.move = data.coord[1];
						data.activePlayer = activePlayer;
						data.onclick = ui.perform.bind(ui, data.move, activePlayer);
					}
				});
			table.insertBefore(
				ui.build(ui.document.createElement('colgroup'),
					base.Iterable.repeat(['col'], game.board.width).toArray()),
				table.firstChild
			);
			return ui;
		}
	});

	/** PlayTesterApp initialization.
	*/
	base.global.APP = new PlayTesterApp(new ludorum_game_connect4.ConnectFour(),
		new ConnectFourHTMLInterface(),
		{ bar: document.getElementsByTagName('footer')[0] },
		[ludorum_game_connect4]
	);
	APP.inputBoardWidth = document.getElementById('boardWidth');
	APP.inputBoardHeight = document.getElementById('boardHeight');
	APP.playerUI("You")
		.playerRandom()
		.playerMonteCarlo("", true, 10)
		.playerMonteCarlo("", true, 100)
		.playerUCT("", true, 10)
		.playerUCT("", true, 100)
		.playerAlfaBeta("", true, 3)
		.playerAlfaBeta("", true, 5)
		.selects(['player0', 'player1'])
		.button('resetButton', document.getElementById('reset'), function () {
			var boardWidth = +APP.inputBoardWidth.value || 7,
				boardHeight = +APP.inputBoardHeight.value || 6;
			APP.game = new ludorum_game_connect4.ConnectFour(null, 
				new ludorum.utils.CheckerboardFromString(boardHeight, boardWidth)
			);
			APP.reset();
		})
		.reset();
}); // init()
}); // require().
