import React, { Component } from 'react';
import config from '../../config';
import AlienList from '../../components/AlienList/AlienList';
import StructureList from '../../components/StructureList/StructureList'
import AlienBuilder from '../../components/AlienBuilder/AlienBuilder';
import StructureConstructor from '../../components/StructureConstructor/StructureConstructor';
import Tasks from '../../components/Tasks/Tasks';
import './GameplayScreen.css';

class GameplayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildAliensMode: false,
      buildStructuresMode: false,
      aliens: [],
      alienInventory: [],
      statusAPI: {},
      status: {
        userid: 0,
        brood_name: 'starter',
        biomass: 25,
        synapse: 5,
        alienInventory: [
          {
            alien_name: 'Worker Drone',
            count: 0,
            living: false,
            toSpawn: 0,
            spawning: false
          },
        ]
      },
      buildOrders: {},
      biomass: 45,
      cost: 0,
      count: 0,
      toBuild: 0,
    };
  };

  // static contextType = AliensContext

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

  //ALL HANDLERS FOR CONDITIONAL CHANGES
  handleBuildModeChange() {
    this.props.buildModeChange();
  };

  handleTaskModeChange() {
    this.props.taskModeChange();
  };

  //ALL HANDLERS FOR UPDATING PLAYER STATUS

  handleUpdateTotalBiomass() {
    let oldBiomass = this.state.biomass;
    const newBiomass = oldBiomass - this.state.cost;
    this.setState({biomass: newBiomass})
    this.setState({cost: 0})
  }

  handleUpdateAlienCount() {
    let oldCount = this.state.count;
    const newCount = oldCount + this.state.toBuild;
    this.setState({count: newCount});
    this.setState({toBuild: 0});
  }

  //ALL HANDLERS FOR SPAWNING ALIENS
  handleClickAlienBuilder = () => {
    this.setState({buildAliensMode: true});
    this.handleBuildModeChange();
  };

  handleAddSpawn = () => {
    console.log('adding');
    let oldCost = this.state.cost;
    const newCost = oldCost +=5;
    this.setState({cost: newCost});
    let oldBuild = this.state.toBuild;
    const newBuild = oldBuild +=1;
    this.setState({toBuild: newBuild});
  };

  handleSubtractBuild = () => {
    console.log('subtracting');
    let oldCost = this.state.cost;
    const newCost = oldCost -=5;
    this.setState({cost: newCost});
    let oldBuild = this.state.toBuild;
    const newBuild = oldBuild -=1;
    this.setState({toBuild: newBuild});
  };

  handleClickSpawn = () => {
    this.setState({buildAliensMode: false});
    let newCount = this.state.toBuild;
    let aliens = this.state.aliens;
    aliens[0] = {...aliens[0], toBuild: newCount} 
    this.setState({ aliens })
    this.handleBuildModeChange();
  };

  handleClickCancel = () => {
    this.setState({buildAliensMode: false});
    this.setState({buildStructuresMode: false});
    this.handleBuildModeChange();
  };

  //ALL HANDLERS FOR STRUCTURE CONSTRUCTION
  handleClickStructureBuilder = () => {
    this.setState({buildStructuresMode: true});
    this.handleBuildModeChange();
  };

  handleClickConstruct = () => {
    this.setState({buildStructuresMode: false});
    this.handleBuildModeChange();
  };

  //ALL HANDLERS FOR TASKS
  handleCancelTasks = () => {
    this.handleTaskModeChange();
  };

  handleCommitTasks = () => {
    this.handleTaskModeChange();
    this.handleUpdateTotalBiomass();
    this.handleUpdateAlienCount();
  };

  renderGameplay() {
    if (this.props.buildMode === true || this.props.taskMode === true) {
      return (
        <div>
          <header className='status-bar'>
            <span className='left'>
              <span className='row'>
                <h4>
                  Biomass: {this.state.biomass}
                </h4>
                <br />
                <h4 className='red'>
                  - {this.state.cost}
                </h4>
                </span>
            </span>
            <span className='center'>
              <h3>Brood Name: {this.state.status.brood_name}</h3>
            </span>
            <span className='right'>
              <h4>Synapse: {this.state.status.synapse}</h4>
            </span>
          </header>
          <section className='gameplay-style reaction-mode'>
            <div className='left aliens-box'>
            <h2>Aliens</h2>
              <AlienList alienInventory={this.state.alienInventory} count={this.state.count} toBuild={this.state.toBuild} />
              <button className='build-aliens-button' disabled>Spawn Aliens</button>
            </div>
            <div className='right alien-structures-box'>
              <h2>Alien Stuctures</h2>
              <StructureList count={this.state.count} toBuild={this.state.toBuild} />
              <button className='build-structures-button' disabled>Build Alien Stuctures</button>
            </div>
            <div>{this.renderBuilders()}</div>
          </section>
        </div>
      )
    } else {
      return (
        <div>
          <header className='status-bar'>
            <span className='left'>
                <span className='row'>
                  <h4>
                    Biomass: {this.state.biomass}
                  </h4>
                  <br />
                  <h4 className='red'>
                    - {this.state.cost}
                  </h4>
                </span>
            </span>
            <span className='center'>
              <h3>Brood Name: {this.state.status.brood_name}</h3>
            </span>
            <span className='right'>
              <h4>Synapse: {this.state.status.synapse}</h4>
            </span>
          </header>
          <section className='gameplay-style'>
            <div className="left aliens-box">
            <h2>Aliens</h2>
              <AlienList alienInventory={this.state.alienInventory} count={this.state.count} toBuild={this.state.toBuild} />
              <button className='build-aliens-button' onClick={() => this.handleClickAlienBuilder()}>Spawn Aliens</button>
            </div>
            <div className="right alien-structures-box">
              <h2>Alien Structures</h2>
              <StructureList count={this.state.count} toBuild={this.state.toBuild} />
              <button className='build-structures-button' onClick={() => this.handleClickStructureBuilder()}>Build Alien Stuctures</button>
            </div>
          <div>{this.renderBuilders()}</div>
        </section>
      </div>
      )
    };
  };

  renderBuilders() {
    const { aliens = [] } = this.state

    if (this.state.buildAliensMode === true) {
      return (
        <div>
          {aliens.filter(alien => alien.buildable === true)
            .filter(buildableAlien => buildableAlien.building === true)
              .map(filteredAlien => (
                <AlienBuilder alien={filteredAlien} handleClickCancel={this.handleClickCancel} handleClickSpawn={this.handleClickSpawn} />
              ))
          }
        </div>
      )
    } else if (this.state.buildStructuresMode === true) {
      return (
        <StructureConstructor handleClickCancel={this.handleClickCancel} handleClickConstruct={this.handleClickConstruct} />
      );
    } else if (this.props.taskMode === true) {
      return (
        <Tasks aliens={aliens}
          handleClickCancel={this.handleCancelTasks} handleClickCommit={this.handleCommitTasks}/>
      );
    } else {
      return
    }
  };

  render() {
    console.log(this.state.aliens)
    console.log(this.state.alienInventory)
    return (
      <div>{this.renderGameplay()}</div>
    );
  };
};

export default GameplayScreen;