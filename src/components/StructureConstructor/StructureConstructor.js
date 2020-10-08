import React, { Component } from 'react';
import config from '../../config';
import Structure from '../Structure/Structure';
import './StructureConstructor.css';

class StructureConstructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      structures: [],
    };
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/structures`)
    ])
      .then(([structuresRes]) => {
        if (!structuresRes.ok)
          return structuresRes.json().then(event => Promise.reject(event))
        return Promise.all([
          structuresRes.json(),
        ])
      })
      .then(([structures]) => {
        this.setState({ structures })
      })
      .catch(error => {
        console.log({error})
      })
  };

  render() {
    const { structures } = this.state
    const cost = this.props.cost
    const toBuild = this.props.toBuild
    
    return (
      <div className='builder-box'>
        <h2>Structure Constructor</h2>
        <hr />
          {structures.filter(structure => structure.buildable === true)
            .map(filteredStructure => (
            <Structure
              id={filteredStructure.id}
              name={filteredStructure.alien_name}
              hp={filteredStructure.hp}
              atk={filteredStructure.atk}
              cost={filteredStructure.biomass_cost}
              synapse={filteredStructure.synapse_required}
              desc={filteredStructure.description}
              features={filteredStructure.special_features}
            />
          ))}
          <span className='row center'>
            <p className='red'>COST: {cost}</p>
            <p className='red'>CONSTRUCT COUNT: {toBuild}</p>
          </span>
          <div className='build-buttons'>
          <button className='arrow-button' onClick={() => this.props.handleMoveLeft()} disabled>LEFT</button> 
            <button className='builder-button' onClick={() => this.props.handleClickSpawn()}>SET CONSTRUCTION</button>
            <button className='builder-button' onClick={() => this.props.handleClickAdd()} disabled>+</button>
            <button className='builder-button' onClick={() => this.props.handleClickSubtract()} disabled>-</button>
            <button className='builder-button' onClick={() => this.props.handleClickCancel()}>CANCEL CONSTRUCTION</button>
            <button className='arrow-button' onClick={() => this.props.handleMoveRight()} disabled>RIGHT</button>
          </div>
      </div>
    );
  };
};

export default StructureConstructor;