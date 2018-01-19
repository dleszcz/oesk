import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { Maintainer } from '../item.component';


describe('Maintainer: Component', () => {
  const defaultProps = {
    data: fromJS({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    }),
  };

  const component = (props) => (
    <Maintainer {...defaultProps} {...props} />
  );

  it('should render Maintainer root', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find('.item')).to.have.length(1);
  });

  it('should render proper text inside .item', () => {
    const wrapper = shallow(component({}));
    expect(wrapper.find('.item').render().text()).to.equal('John Doe <john.doe@example.com>');
  });
});
