import React, { Component } from 'react';
import config from '../../config';
import './StructureList.css';

class AlienList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      structureInventory: [],
    };
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/structureInventory`)
    ])
      .then(([structureInventoryRes]) => {
        if (!structureInventoryRes.ok)
          return structureInventoryRes.json().then(event => Promise.reject(event))
        return Promise.all([
          structureInventoryRes.json(),
        ])
      })
      .then(([structureInventory]) => {
        this.setState({ structureInventory })
      })
      .catch(error => {
        console.log({error})
      });
  }

  render() {
    const { structureInventory=[] } = this.state

    return (
      <div className='list-box'>
        {structureInventory.filter(structure => structure.amount > 0)
          .map(filteredStructure => (
          <ul className='left-list'>
            <li className='item'>Name: {filteredStructure.structure_name}</li>
            <li className='item'>Count: {filteredStructure.amount}</li>
          </ul>
        ))}
      </div>
    )   
  };
};

export default AlienList;