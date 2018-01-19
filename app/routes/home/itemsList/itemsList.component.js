import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from './itemsList.messages';
import { Item } from '../item/item.component';


export class ItemsList extends PureComponent {
  static propTypes = {
    items: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="items-list">
        <h2 className="items-list__title">
          <FormattedMessage {...messages.title} />:
        </h2>

        <ul>
          {this.props.items.toArray().map((item, key) => (
            <Item key={key} data={item} />
          ))}
        </ul>
      </div>
    );
  }
}
