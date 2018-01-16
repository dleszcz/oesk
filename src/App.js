import React, { Component } from 'react';
import axios from 'axios';
import { map } from 'ramda';

import './App.css';

class App extends Component {

  state = {
    albums: [],
    mountingTime: 0,
    paintingTime: 0,
  };

  componentWillMount() {
    this.componentWillMountTimeStamp = window.performance.now();

    axios.get('https://jsonplaceholder.typicode.com/photos')
      .then((response) => {
        console.log(response.data);

        this.setState({
          albums: response.data,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.componentDidMountTimeStamp = window.performance.now();

    this.setState({
      mountingTime: this.componentDidMountTimeStamp = this.componentWillMountTimeStamp,
    })
  }

  renderItems = () => (
    <div className="albums">
      {
        map((album) =>
          <div className="albums__item" key={album.id}>
            <div className="albums__item-title">{`${album.id}: ${album.title}`}</div>
            <img src={album.thumbnailUrl} className="albums__item-image" alt="logo" />
          </div>,
        this.state.albums)
      }
    </div>
  );

  render() {
    const { albums } = this.state;

    return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to React</h1>
        <h2 className="App-title">{ `Mounting time: ${this.state.mountingTime}` }</h2>
        <h2 className="App-title">{ `Painting time: ${this.state.paintingTime}` }</h2>
      </header>

      { albums ? this.renderItems() : null }
    </div>
    );
  }
}

export default App;
