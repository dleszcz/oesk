import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Item extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="item" key={this.props.data.get('id')}>
        <div className="item-title">{`${this.props.data.get('id')}: ${this.props.data.get('title')}`}</div>
        <img src={this.props.data.get('thumbnailUrl')} className="item-image" alt="image" />
      </div>
    );
  }
}
