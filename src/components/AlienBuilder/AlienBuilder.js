import React, { Component } from 'react';
import config from '../../config';
import Alien from '../Alien/Alien';
import './AlienBuilder.css';

class AlienBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aliens: [],
      cost: 0,
      toBuild: 0,
    };
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/aliens`)
    ])
      .then(([aliensRes]) => {
        if (!aliensRes.ok)
          return aliensRes.json().then(event => Promise.reject(event))
        return Promise.all([
          aliensRes.json(),
        ])
      })
      .then(([aliens]) => {
        this.setState({ aliens })
      })
      .catch(error => {
        console.log({error})
      })
  };

  addTotalCost(alienCost, cost) {
    debugger
    console.log(cost)
    console.log(alienCost)
    debugger
  };

  subtractTotalCost() {
  };

  render() {
    const { alien } = this.props
    const { cost } = this.state
    const alienCost = alien.biomass_cost
    
    return (
      <div className='builder-box'>
        <h2>Alien Spawner</h2>
        <hr />
        <form>
          <Alien 
            id={alien.id}
            name={alien.alien_name}
            hp={alien.hp}
            atk={alien.atk}
            cost={alien.biomass_cost}
            synapse={alien.synapse_required}
            desc={alien.description}
            features={alien.special_features}
          />
          <span className='row center'>
            <p className='red'>COST: {this.state.cost}</p>
            <p className='red'>SPAWN COUNT: {this.state.toBuild}</p>
          </span>
          <div className='buttons'>
            <button className='arrow-button' onClick={() => this.props.handleMoveLeft()} disabled>LEFT</button> 
            <button className='builder-button' onClick={(event) => this.props.handleClickSpawn(event)}>SET SPAWNS</button>
            <button className='builder-button' onClick={this.addTotalCost()}>+</button>
            <button className='builder-button' onClick={(event) => this.subtractTotalCost(event)}>-</button>
            <button className='builder-button' onClick={() => this.props.handleClickCancel()}>CANCEL SPAWNS</button>
            <button className='arrow-button' onClick={() => this.props.handleMoveRight()} disabled>RIGHT</button>
          </div>
        </form>
      </div>
    );
  };
};

export default AlienBuilder;