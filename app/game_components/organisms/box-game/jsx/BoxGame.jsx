import React, { Component, PropTypes } from 'react';

import Timer from '../../../atoms/timer';

const ORGANISM_NAME = 'box-game';
const DEFAULT_BOX_COUNT = 25;
const DEFAULT_BOX_PER_ROW = 5;
const DEFAULT_HIGHLIGHT_ROW = 5;
const DEFAULT_CHANCES = 3;
const GAME_STATUS_CODE = {
		INACTIVE: 0,
		PLAY: 1,
		SUCCESS: 2,
		FAILED: 3,
		GAMEOVER: 4,
};
export default class BoxGame extends Component {
	constructor(props) {
		super(props);

		const {
			config: {
				chances = DEFAULT_CHANCES
			} = {},
		} = props;

		this.chances = chances;
		this.state = {
			gameStatus: GAME_STATUS_CODE.INACTIVE,
			chances: this.chances,
			ShadedBox: {},
		};

		this.handleBox = this.handleBox.bind(this);
		this.handleTimeout = this.handleTimeout.bind(this);
		this.handleStartButton = this.handleStartButton.bind(this);
		this.handleRestartButton = this.handleRestartButton.bind(this);
		this.handlePlayAgainButton = this.handlePlayAgainButton.bind(this);
	}

	checkGameCompletionStatus() {
		if (Object.keys(this.state.ShadedBox).length === 0) {
			this.setState({
				gameStatus: GAME_STATUS_CODE.SUCCESS,
			});
		}
	}

	handleBox(count) {
		const {
			gameStatus,
			ShadedBox,
		} = this.state;
		if (gameStatus === GAME_STATUS_CODE.PLAY) {
			if (ShadedBox[count]) {
				delete ShadedBox[count];
			} else {
				ShadedBox[count] = true;
			}
			this.setState({
					ShadedBox,
				},
				this.checkGameCompletionStatus
			);
		}
	}

	handleStartButton() {
		if (this.state.gameStatus === GAME_STATUS_CODE.INACTIVE) {
			const ShadedBox = this.getRandomBox(this.boxCount, this.highlightCount);
			this.setState({
				ShadedBox,
				gameStatus: GAME_STATUS_CODE.PLAY,
			});
		}
	}

	handleRestartButton() {
		if(this.state.gameStatus) {
			const ShadedBox = this.getRandomBox(this.boxCount, this.highlightCount);
			this.setState({
				ShadedBox,
				chances: DEFAULT_CHANCES,
				gameStatus: GAME_STATUS_CODE.PLAY,
			})
		}
	}

	handlePlayAgainButton() {
		const {
			gameStatus,
			chances,
			ShadedBox,
		} = this.state;
		if (gameStatus === GAME_STATUS_CODE.FAILED) {
			const ShadedBox = this.getRandomBox(this.boxCount, this.highlightCount);
			this.setState({
				ShadedBox,
				gameStatus: GAME_STATUS_CODE.PLAY,
			})
		}
	}

	handleTimeout() {
		const {
			gameStatus,
			chances
		} = this.state;
		if (gameStatus === GAME_STATUS_CODE.PLAY) {
			const newChances = chances - 1;
			this.setState({
				chances: newChances,
				gameStatus: (newChances > 0)? GAME_STATUS_CODE.FAILED: GAME_STATUS_CODE.GAMEOVER,
			});
		}
	}

	renderHeadline(headline) {
		if (headline.text) {
			return (
				<h2
					dangerouslySetInnerHTML={{__html: headline.text}}
					className={`${ORGANISM_NAME}__headline`}
				/>
			);
		}
		return null;
	}

	renderTimer(timer) {
		if (this.state.gameStatus === GAME_STATUS_CODE.PLAY) {
			return (
				<Timer
					{...timer}
					onTimeout={this.handleTimeout}
				/>
			);
		}
		return null;
	}

	renderChancesLeft() {
		if (this.state.gameStatus >= GAME_STATUS_CODE.PLAY) {
			const Lifes = [];
			for (let chances=0; chances < this.chances; chances++) {
				const isChancesLost = chances < this.state.chances ? `${ORGANISM_NAME}__chances--lost`: '';
				Lifes.push(
					<span
						className={`${ORGANISM_NAME}__chances ${isChancesLost}`}
						key={`${ORGANISM_NAME}__chances-${chances}`}
					/>
				);
			}

			console.log(Lifes.length);
			return(
				<div className={`${ORGANISM_NAME}__chances-container`}>
					{Lifes}
				</div>
			);
		}
		return null;
	}

	renderStatusButtons({ startButton, restartButton, PlayAgainButton} = {}) {
		const {
			 gameStatus,
			 chances,
		} = this.state;
		if (gameStatus === GAME_STATUS_CODE.SUCCESS || gameStatus === GAME_STATUS_CODE.GAMEOVER)  {
			return (
				<button
					className={`btn btn-default btn-warning ${ORGANISM_NAME}__button ${ORGANISM_NAME}__button--restart`}
					onClick={this.handleRestartButton}
					>
						{restartButton.text}
					</button>
				);
			} else if (gameStatus === GAME_STATUS_CODE.FAILED && chances > 0) {
				return (
					<button
						className={`btn btn-default btn-warning ${ORGANISM_NAME}__button ${ORGANISM_NAME}__button--try`}
						onClick={this.handlePlayAgainButton}
					>
						{PlayAgainButton.text}
					</button>
				);
			}
			return (
				<button
					className={`btn btn-default btn-success ${ORGANISM_NAME}__button ${ORGANISM_NAME}__button--start`}
					onClick={this.handleStartButton}
					disabled={gameStatus === GAME_STATUS_CODE.PLAY}
				>
					{startButton.text}
				</button>
			);
	}

	renderNotification({ success, failure, loseLife} = {}) {
		const {
			gameStatus,
		} = this.state;
		if (gameStatus) {
			if (gameStatus === GAME_STATUS_CODE.SUCCESS) {
				return (
					<p
						className={`${ORGANISM_NAME}__notification-text ${ORGANISM_NAME}__notification-text--success`}
						dangerouslySetInnerHTML={{ __html: success.text }}
					/>
				);
			} else if (gameStatus === GAME_STATUS_CODE.GAMEOVER) {
				return (
					<p
						className={`${ORGANISM_NAME}__notification-text ${ORGANISM_NAME}__notification-text--failure`}
						dangerouslySetInnerHTML={{ __html: failure.text }}
					/>
				);
			} else if (gameStatus === GAME_STATUS_CODE.FAILED) {
				return (
					<p
						className={`${ORGANISM_NAME}__notification-text ${ORGANISM_NAME}__notification-text--failure`}
						dangerouslySetInnerHTML={{ __html: loseLife.text }}
					/>
				);
			}
		}
		return null;
	}

	getRandomBox(boxCount, highlightCount) {
		let count = 0;
		const ShadedBox = {};
		while(count < highlightCount) {
			const randomGen = parseInt(Math.random() * (boxCount - 1), 0);
			if (ShadedBox[randomGen] !== true) {
					ShadedBox[randomGen] = true;
					count++;
			}
		}
		return ShadedBox;
	}

	renderBoxes({
		boxCount = DEFAULT_BOX_COUNT,
		boxPerRow = DEFAULT_BOX_PER_ROW,
		highlightCount = DEFAULT_HIGHLIGHT_ROW,
	} = {}) {
		if (boxCount) {
			this.boxCount = boxCount < 10 ? DEFAULT_BOX_COUNT : boxCount;
			this.boxPerRow = Math.min(boxCount, boxPerRow) > boxCount ? DEFAULT_BOX_PER_ROW : boxPerRow;
			this.highlightCount = Math.min(boxCount, highlightCount) > boxCount ? DEFAULT_HIGHLIGHT_ROW : highlightCount;
			const {
				ShadedBox
			} = this.state;
			const row = [];
			const noOfRow = (this.boxCount - (this.boxCount % this.boxPerRow)) / this.boxPerRow;

			for(let rows = 0; rows<noOfRow; rows++) {
				var column = [];
				for (let columns=0; columns<this.boxPerRow; columns++) {
					const boxNumber =  (rows * this.boxPerRow) + columns;

					column.push(
							<td
								key={`${ORGANISM_NAME}__table-box-${boxNumber}`}
								className={ShadedBox[boxNumber] ? `${ORGANISM_NAME}__box ${ORGANISM_NAME}__box--colored` : `${ORGANISM_NAME}__box`}
								onClick={() => this.handleBox(boxNumber)}
								data-box-number={boxNumber}
							/>
					);
				}
				row.push(
					<tr key={`${ORGANISM_NAME}__table-row-${rows}`}>
						{column}
					</tr>
				);
			}

			return (
				<tbody>
					{row}
				</tbody>
			);

		}
		return null;
	}

	render() {
		const {
			config: {
				id,
			} = {},
			content: {
				headline,
				infoButton,
				notification,
				timer,
				box,
			} = {},
			className = "",
		} = this.props;

		const isGameEnded = (this.state.gameStatus > GAME_STATUS_CODE.PLAY) ?
					`${ORGANISM_NAME}__table-container--end-game` : '';

		return (
			<section
				id={id}
				className={`${ORGANISM_NAME} ${className}`}
				data-component-name={ORGANISM_NAME}
				data-component-type="organism"
			>
				<div className="row">
						{this.renderHeadline(headline)}
				</div>
				<div className={`${ORGANISM_NAME}__info-bar row`}>
						<div className="text-left col-lg-4 col-md-4 col-sm-4 col-xs-12">
							{this.renderTimer(timer)}
						</div>
						<div className="text-left col-lg-4 col-md-4 col-sm-4 col-xs-12">
							{this.renderChancesLeft()}
						</div>
						<div className="text-right col-lg-4 col-md-4 col-sm-4 col-xs-12">
								{this.renderStatusButtons(infoButton)}
						</div>
				</div>

				<div className={`${ORGANISM_NAME}__table-container text-center ${isGameEnded}`}>
					<div className={`${ORGANISM_NAME}__notification-bar`}>
						{this.renderNotification(notification)}
					</div>
					<table className="box-game__table">
						{this.renderBoxes(box)}
					</table>
				</div>
			</section>
		);
	}
}

BoxGame.propTypes = {
	config: PropTypes.shape({
		id: PropTypes.string,
		chances: PropTypes.number,
	}),
	content: PropTypes.shape({
		headline: PropTypes.shape({
			text: PropTypes.string.isRequired,
		}).isRequired,
		infoButton: PropTypes.shape({
			startButton: PropTypes.shape({
				text: PropTypes.string.isRequired,
			}).isRequired,
			PlayAgainButton: PropTypes.shape({
				text: PropTypes.string.isRequired,
			}).isRequired,
			restartButton: PropTypes.shape({
				text: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
		notification: PropTypes.shape({
			success: PropTypes.shape({
				text: PropTypes.string,
			}),
			failure: PropTypes.shape({
				text: PropTypes.string,
			}),
			loseLife: PropTypes.shape({
				text: PropTypes.string,
			}),
		}).isRequired,
		timer: PropTypes.shape(Timer.propTypes).isRequired,
		box: PropTypes.shape({
			boxCount: PropTypes.number,
			boxPerRow: PropTypes.number,
			highlightCount: PropTypes.number,
		}),
	}),
	className: PropTypes.string,
}

BoxGame.defaultProps = {
		config: {
			id: "",
		},
		content: {
			headline: {
				text: "Box Game",
			},
			infoButton: {
				startButton: {
					text: "Start Game"
				},
				PlayAgainButton: {
					text: "Try Again"
				},
				restartButton: {
					text: "Restart Game"
				},
			},
			notification: {
				success: {
					text: "Hurrey, You just won the game. Click Restart to play again."
				},
				failure: {
					text: "Oh No, lets start all over again."
				},
				loseLife: {
					text: "Come dude, let's try one more time. Click Try again"
				}
			},
			timer: {
				count: 25000,
				prefixText: "Time left",
			  formattedText: "Seconds",
			  className: "defualt-timer",
			},
			box: {
				boxCount: 25,
				boxPerRow: 5,
				highlightCount: 5,
			}
		},
		className: "custombox-game",
};
