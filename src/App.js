import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';

/**
 * @class App
 * @extends React Component
 * @description Main component of the game. It holds the state of the game.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      rows: 10, 
      columns: 10, 
      isGameStarted: false,
      hitList: [],
      mushroomBoxes: [],
      movesList: [],
      gameIsWon: false,
      numberOfMushrooms: 0
    }
    this.timer = null;
    this.clock = this.clock.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateGameBoard = this.updateGameBoard.bind(this);
    this.evaluateMarioPosition = this.evaluateMarioPosition.bind(this);
  }
  
  componentDidCatch(error, info){
    console.log(error, info)
  }
  
  /**
   * @method componentDidUpdate
   * @description Binds and unbinds the handleKeyPress method to the Windows keyup event.
   */
  componentDidUpdate() {
    this.state.isGameStarted && window.addEventListener('keyup', this.handleKeyPress);
    !this.state.isGameStarted && window.removeEventListener('keyup', this.handleKeyPress);
  }

  /**
   * @method evaluateMarioPosition
   * @description Evaluates the position of Mario on the board and determines the directions which Mario can move at.
   * @return {object} marioDirections
   */
  evaluateMarioPosition(){
    const { marioBox, columns, rows } = this.state;;
    const quotient = marioBox / columns;
    const modulus = marioBox % columns;

    return {
      MarioMoveUp: Math.floor(quotient) > 0,
      MarioMoveDown: Math.ceil(quotient) < rows && (rows - quotient > 1),
      MarioMoveLeft: (modulus) > 0,
      MarioMoveRight: (modulus) < (columns - 1)
    }
  }

  /**
   * @method handleKeyPress
   * @param {KeyboardEvent} e The keyboard event
   * @description Handles the keypress event and evaluates key presses of the player and translates them to changes in the position of Mario.
   */
  handleKeyPress(e){
    const keyIsNotValid = [27,37,38,39,40].indexOf(e.which) < 0;
    if(keyIsNotValid) return;

    let { hitList, marioBox, columns, movesList } = this.state;
    const can = this.evaluateMarioPosition();

    switch(e.which){
      case 27:
        if(movesList.length < 1) return;
        marioBox = movesList.pop();

        const mushroomBoxes = hitList.pop();
        const gameIsWon = mushroomBoxes.length === 0;

        this.setState({ marioBox, movesList, mushroomBoxes, hitList, gameIsWon });
        return;

      case 37:
        if(!can.MarioMoveLeft) return;
        --marioBox;
        break; 

      case 38:
        if(!can.MarioMoveUp) return;
        marioBox -= columns;
        break; 

      case 39:
        if(!can.MarioMoveRight) return;
        ++marioBox;
        break;

      case 40:
        if(!can.MarioMoveDown) return;
        marioBox += columns;
        break; 

      default:
    }
    this.updateGameBoard(marioBox);
  }
  
  /**
   * @method updateGameBoard
   * @param {number} marioBox The boardIndex of the box that Mario is occupying on the board.
   * @description Updates the state of the app to cause changes on the game board.
   */
  updateGameBoard(marioBox){
    let { hitList, mushroomBoxes, movesList } = this.state;
    hitList.push(Object.assign([], this.state.mushroomBoxes));
    movesList.push(this.state.marioBox);

    const knockOutBoxIndex = mushroomBoxes.lastIndexOf(marioBox);
    knockOutBoxIndex >= 0 && mushroomBoxes.splice(knockOutBoxIndex, 1);

    const gameIsWon = mushroomBoxes.length === 0;
    this.setState({ marioBox, movesList, mushroomBoxes, gameIsWon, hitList }, () => {
      if (this.state.gameIsWon) {
        clearInterval(this.timer);
        alert(`Game Over. Total moves to save princess: ${movesList.length}`);
      }
    });
  }

  /**
   * @method componentDidMount
   * @description beginnning of App With Prompt for numer of rows.
   */
  componentDidMount(){
   this.setBoardRows();
  }

  /**
   * @method setBoardRows
   * @description method will prompt and set number of rows and mushrooms in App State.
   */
  setBoardRows(){
    const boardRows = prompt("Please enter board Width", "");
    if (boardRows != null) {
      this.setState({
        rows: parseInt(boardRows, 10),
        numberOfMushrooms: parseInt(boardRows, 10)
      }, () => {
        this.setBoardColumns();
      })
    }
  }

   /**
   * @method setBoardColumns
   * @description method will prompt and set number of columns and mushroom Boxes in App State.
   */
  setBoardColumns(){
    const boardColumns = prompt("Please enter board Width", "");
    if (boardColumns != null) {
      const columns =  parseInt(boardColumns, 10);
      const boardLimit = this.state.rows * columns;
      const mushroomBoxes = this.createToadBoxes(boardLimit, this.state.numberOfMushrooms);
      const marioBox = mushroomBoxes.shift();
      this.setState({
        columns: columns,
        isGameStarted: true,
        mushroomBoxes, marioBox,
        hitList: []
      })
    }
    this.timer = setInterval(this.clock, 1000);
  }
    /**
   * @method CreateToadBoxes
   * @param {number} boardLimit The highest index any box can occupy on the game board.
   * @param {number} numberOfMushrooms The number of toads for Mario to catch on the game board.
   * @returns {number[]} An array of indexes occupied by the boxes with toads.
   */
  createToadBoxes(boardLimit, numberOfMushrooms){
    const mushroomBoxes = [];
    do{
      const boardIndex = Math.floor(Math.random() * boardLimit);
      mushroomBoxes.indexOf(boardIndex) < 0 && (
        mushroomBoxes.push(boardIndex)
      )
    }
    while(mushroomBoxes.length <= numberOfMushrooms);
    return mushroomBoxes;
  }

  /**
   * @method clock
   * @description Counts the time spent when playing the game.
   */
  clock(){
    let timer = this.state.time + 1;
    this.setState({ time: timer })
  }
  
  render() {
    return (
      <div className="App">
      <Board data={this.state} />
      </div>
    );
  }
}

export default App;
