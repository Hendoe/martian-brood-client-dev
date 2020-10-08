import React, { Component } from 'react';
import config from '../../config';
import './AlienList.css';

class AlienList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alienInventory: [],
    };
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/alienInventory`)
    ])
      .then(([alienInventoryRes]) => {
        if (!alienInventoryRes.ok)
          return alienInventoryRes.json().then(event => Promise.reject(event))
        return Promise.all([
          alienInventoryRes.json(),
        ])
      })
      .then(([alienInventory]) => {
        this.setState({ alienInventory })
      })
      .catch(error => {
        console.log({error})
      });
  }


  render() {
    const { alienInventory=[] } = this.state

    return (
      <div className='list-box'>
        {alienInventory.filter(alien => alien.amount > 0)
          .map(filteredAlien => (
          <ul className='left-list'>
            <li className='item'>Count: {filteredAlien.amount}</li>
            <li className='item'>Name: {filteredAlien.alien_name}</li>
          </ul>
        ))}
      </div>
    )   
  };
};

export default AlienList;