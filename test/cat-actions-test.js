import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/catActions'
import nock from 'nock'

// change to redux thunk
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('uses redux-promise to create an action object with type of "FETCH_CATS" and a payload of cat images when fetchCats is dispatched', () => {
    nock('http://localhost:3000')
      .get('/db')
      .reply(200, { images: [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}] })

    const expectedActions = [
      {type: 'LOADING_CATS'},
      { type: "FETCH_CATS", payload: [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}] }
    ]
    const store = mockStore({})
    return store.dispatch(actions.fetchCats())
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
