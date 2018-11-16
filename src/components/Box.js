import React, { Component } from 'react'; 
import { FlatList } from './Utils';
import mario_crop from '../files/mario-crop.jpg';
import toad from '../files/toad-blue.jpg';

/**
 * @class Box
 * @extends ReactComponent
 * @description Renders boxes on the game board.
 */
export default class Box extends Component {
  constructor(props) {
    super(props)
    this.BoxView = this.BoxView.bind(this);
  }

  /**
   * @method BoxView
   * @param {React.Props} boxProps 
   * @description Renders a Mario image or blank space as view on a Box component.
   * @return {HTMLElement|null} Image or null.
   */
  BoxView(boxProps){
    const { toadBoxIndex, thisIsLastIndex } = boxProps;
    const { boardIndex, data } = this.props;
    const { marioBox } = data;
    const thisIsMarioBox =  boardIndex === marioBox;
    if(toadBoxIndex === boardIndex){
      return (
        <img src={toad} alt="mushrooms on the game board"/>
      )
    }
    else if(thisIsLastIndex && thisIsMarioBox){
      return (
        <img src={mario_crop} alt="mario catching mushrooms on the game board" />
      )
    }
    else return null;      
  }
  

  render() {
    const { BoxView } = this;
    const { mushroomBoxes } = this.props.data;
    return (
      <div className="box">
        <FlatList
          list={mushroomBoxes}
          listView={(i, o, u) => (
            <BoxView 
              key={`toad ${i}`}
              toadBoxIndex={i}
              thisIsLastIndex={o === u.length - 1}
            />
          )}
        /> 
      </div>
    )
  }
}
