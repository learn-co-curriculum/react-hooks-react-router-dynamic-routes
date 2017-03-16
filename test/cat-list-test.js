import React from 'react'
import { shallow, mount } from 'enzyme'
import expect, { createSpy, spyOn, isSpy } from 'expect'
import ReactTestUtils from 'react-addons-test-utils'
import CatList from '../src/CatList'


describe('<CatList/>', function () {

  const catPics = [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}]
  it('should display the cat pics wrapped in <img> tags', function () {
    const wrapper = shallow(<CatList catPics={catPics}/>);
    expect(wrapper.find('img').length).toEqual(2);
  });

  it('should have props catPics', function () {
    const wrapper = shallow(<CatList catPics={catPics}/>);
    expect(wrapper.props().catPics).toBe.defined;
  });
});
