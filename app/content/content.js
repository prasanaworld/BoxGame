export default {
	"config": {
		"id": "my-boxgame",
		chances: 3,
	},
	"content": {
		"headline": {
			"text": "Box Game"
		},
		"infoButton": {
			"startButton": {
				"text": "Start Game"
			},
			"PlayAgainButton": {
				"text": "Try Again"
			},
			"restartButton": {
				"text": "Restart Game"
			}
		},
		"notification": {
			"success": {
				"text": "Hurrey, You just won the game. Click Restart to play again."
			},
			"failure": {
				"text": "Oh No, lets start all over again."
			},
			"loseLife": {
				"text": "Come dude, let's try one more time. Click Try again"
			}
		},
		"timer": {
			"count": 5000,
			"prefixText": "Time left",
			"formattedText": "Seconds",
			"className": "defualt-timer"
		},
		"box": {
			"boxCount": 25,
			"boxPerRow": 5,
			"highlightCount": 5
		}
	},
	"className": "my-custombox-game"
}
