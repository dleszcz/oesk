import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { MaintainerList } from '../itemsList.component';
import { Maintainer } from '../../item/item.component';
import messages from '../itemsList.messages';


describe('MaintainerList: Component', () => {
  const defaultProps = {
    items: fromJS([1, 2, 3]),
  };

  const component = (props) => (
    <MaintainerList {...defaultProps} {...props} />
  );

  it('should render MaintainerList root', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find('.item-list')).to.have.length(1);
  });

  it('should render item-list__title', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find('.item-list__title')).to.have.length(1);
  });

  it('should render title message inside .item-list__title', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find('.item-list__title').find(FormattedMessage).prop('id')).to.equal(messages.title.id);
  });

  it('should proper number of <Maintainer />', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find(Maintainer)).to.have.length(defaultProps.items.size);
  });

  it('should pass data prop to <Maintainer />', () => {
    const wrapper = shallow(component({}));

    defaultProps.items.forEach((item, index) => {
      expect(wrapper.find(Maintainer).at(index).prop('data')).to.equal(item);
    });
  });
});
