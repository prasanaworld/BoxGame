import React, { Component, PropTypes } from 'react';

import Timer from '../../../atoms/timer';

const ORGANISM_NAME = 'box-game';
const DEFAULT_BOX_COUNT = 25;
const DEFAULT_BOX_PER_ROW = 5;
const DEFAULT_HIGHLIGHT_ROW = 5;
const GAME_STATUS_CODE = {
		PLAY: 0,
		SUCCESS: 1,
		FAILED: 2,
};
export default class BoxGame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startGame: false,
			endGame: GAME_STATUS_CODE.PLAY,
			ShadedBox: {},
		};

		this.handleBox = this.handleBox.bind(this);
		this.handleStartButton = this.handleStartButton.bind(this);
		this.handleRestartButton = this.handleRestartButton.bind(this);
		this.handleTimeout = this.handleTimeout.bind(this);
	}

	handleBox(count) {
		if (this.state.startGame) {
				const {
					ShadedBox,
				} = this.state;
				if (ShadedBox[count]) {
					delete ShadedBox[count];
				} else {
					ShadedBox[count] = true;
				}
				this.setState({
					ShadedBox,
				}, () => {
					const {
						ShadedBox,
					} = this.state;
					if (Object.keys(ShadedBox).length === 0) {
						this.setState({
							startGame: false,
							endGame: GAME_STATUS_CODE.SUCCESS,
						})
					}
				});
		}
	}

	handleStartButton() {
		if (!this.state.startGame) {
			const ShadedBox = this.getRandomBox(this.boxCount, this.highlightCount);
			this.setState({
					startGame: true,
					ShadedBox,
			});
		}
	}

	handleRestartButton() {
		if(this.state.endGame) {
			const ShadedBox = this.getRandomBox(this.boxCount, this.highlightCount);
			this.setState({
				startGame: true,
				endGame: GAME_STATUS_CODE.PLAY,
				ShadedBox,
			})
		}
	}

	handleTimeout() {
		if (!this.state.endGame) {
			this.setState({
				startGame: false,
				endGame: GAME_STATUS_CODE.FAILED,
			})
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
		if (this.state.startGame) {
			return (
				<Timer
					{...timer}
					onTimeout={this.handleTimeout}
				/>
			);
		}
		return null;
	}

	renderStartButton({ startButton, restartButton } = {}) {
		if (!this.state.endGame) {
			return (
				<button
					className={`btn btn-default btn-success ${ORGANISM_NAME}__button ${ORGANISM_NAME}__button--start`}
					onClick={this.handleStartButton}
					disabled={this.state.startGame}
				>
					{startButton.text}
				</button>
			);
		}
		return (
			<button
				className={`btn btn-default btn-warning ${ORGANISM_NAME}__button ${ORGANISM_NAME}__button--restart`}
				onClick={this.handleRestartButton}
			>
				{restartButton.text}
			</button>
		);
	}

	renderNotification({ success, failure} = {}) {
		const {
			endGame,
		} = this.state;
		if (endGame) {
			if (endGame === GAME_STATUS_CODE.SUCCESS) {
				return (
					<p
						className={`${ORGANISM_NAME}__notification-text ${ORGANISM_NAME}__notification-text--success`}
						dangerouslySetInnerHTML={{ __html: success.text }}
					/>
				);
			} else if (endGame === GAME_STATUS_CODE.FAILED) {
				return (
					<p
						className={`${ORGANISM_NAME}__notification-text ${ORGANISM_NAME}__notification-text--failure`}
						dangerouslySetInnerHTML={{ __html: failure.text }}
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

		const isGameEnded = this.state.endGame ? `${ORGANISM_NAME}__table-container--end-game` : '';

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
						<div className="text-left col-lg-6 col-md-6 col-sm-6 col-xs-12">
							{this.renderTimer(timer)}
						</div>
						<div className="text-right col-lg-6 col-md-6 col-sm-6 col-xs-12">
								{this.renderStartButton(infoButton)}
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
	}),
	content: PropTypes.shape({
		headline: PropTypes.shape({
			text: PropTypes.string,
		}),
		infoButton: {
			startButton: PropTypes.shape({
				text: PropTypes.string,
			}),
			restartButton: PropTypes.shape({
				text: PropTypes.string,
			}),
		},
		notification: {
			success: PropTypes.shape({
				text: PropTypes.string,
			}),
			failure: PropTypes.shape({
				text: PropTypes.string,
			}),
		},
		timer: PropTypes.shape(Timer.propTypes),
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
					text: "Start"
				},
				restartButton: {
					text: "Restart"
				},
			},
			notification: {
				success: {
					text: "Hurrey, You just won the game. Click Restart to play again."
				},
				failure: {
					text: "Come dude, let's try one more time. Click Restart to play again."
				},
			},
			timer: {
				count: 5000,
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
