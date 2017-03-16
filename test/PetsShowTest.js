import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';

import FakeProvider from './FakeProvider';
import PetsShow from '../src/containers/PetsShow';

describe('PetsShow', function(){

  it('renders the pets show component', function(){
    const wrapper = mount(<FakeProvider>< PetsShow routeParams={{id: 1}} /></FakeProvider>);
    expect(wrapper.find('h2').length).toEqual(1, 'Pets show should have an h2 with the pets name');
    expect(wrapper.find('h2').text()).toEqual('Grover');
  })

  it('finds the pet by the route ID', function(){
    const wrapper = mount(<FakeProvider>< PetsShow routeParams={{id: 2}} /></FakeProvider>);
    expect(wrapper.find('h2').length).toEqual(1, 'The name should be based on the id of the pet');
    expect(wrapper.find('h2').text()).toEqual('Fido');
  })

})
