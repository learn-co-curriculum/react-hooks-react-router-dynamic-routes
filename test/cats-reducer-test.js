import catsReducer from '../src/reducers/cats_reducer'
import expect from 'expect'

describe('cats reducer', () => {
  it('should return the initial state', () => {
    expect(
      catsReducer(undefined, {})
    ).toEqual({loading: false, pictures: []})
  })

  it('should handle the FETCH_CATS action', () => {
    const catPics = [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}]
    expect(
      catsReducer([], {
        type: 'FETCH_CATS',
        payload:  catPics
      })
    ).toEqual({loading: false, pictures: catPics})
  })
})
