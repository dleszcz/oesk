import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Maintainer extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="albums__item" key={this.props.data.get('id')}>
        <div className="albums__item-title">{`${this.props.data.get('id')}: ${this.props.data.get('title')}`}</div>
        <img src={this.props.data.get('thumbnailUrl')} className="albums__item-image" alt="logo" />
      </div>
    );
  }
}
