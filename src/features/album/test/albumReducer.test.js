import reducer from './../albumReducer'
import * as actions from './../albumActions'
import * as mockGenerator from '../../../common/helper/mockGenerator'

describe('Test album reducer', () => {

    let album1 = {};
    let album2 = {};

    beforeEach(() => {
        album1 = mockGenerator.CreateAlbum({ id: 1 })
        album2 = mockGenerator.CreateAlbum({ id: 2 })
    })

    it('should return previous state when incorrect action called', () => {
        let nextState = reducer({ a: '1' }, undefined)

        expect(nextState).toBeTruthy()
        expect(nextState.a).toBeTruthy()
    })

    it('should append params when fetch search album', () => {
        const expectedResult = { nameMatchMode: 'auto', artistId: [ 1 ] }
        let currentState = {
            searchParams: { nameMatchMode: 'auto' }
        }

        let nextState = reducer(currentState, actions.fetchSearchAlbums({ artistId: [ 1 ] }))

        expect(nextState).toBeTruthy()
        expect(nextState.searchParams).toBeTruthy()
        expect(nextState.searchParams).toEqual(expectedResult)
    })

    it('should return state correctly when fetch search albums success', () => {
        const mockResponse = [ album1, album2 ]
        const expectedResult = [ album1.id, album2.id ]
        let currentState = {
            searchResult: [ 3, 4 ]
        }

        let nextState = reducer(currentState, actions.fetchSearchAlbumsSuccess(mockResponse))

        expect(nextState).toBeTruthy()
        expect(nextState.searchResult).toBeTruthy()
        expect(nextState.searchResult).toEqual(expectedResult)
    })

    it('should return state correctly when fetch latest albums success', () => {
        const mockResponse = [ album1, album2 ]
        const expectedResult = [ album1.id, album2.id ]

        let nextState = reducer({}, actions.fetchLatestAlbumsSuccess(mockResponse))

        expect(nextState).toBeTruthy()
        expect(nextState.all).toBeTruthy()
        expect(nextState.all).toEqual(expectedResult)
    })

    it('should return state correctly when fetch top albums success', () => {
        const mockResponse = [ album1, album2 ]
        const expectedResult = [ album1.id, album2.id ]

        let nextState = reducer({}, actions.fetchTopAlbumsSuccess(mockResponse))

        expect(nextState).toBeTruthy()
        expect(nextState.top).toBeTruthy()
        expect(nextState.top).toEqual(expectedResult)
    })

    it('should return state correctly when fetch album detail success', () => {
        const album1 = mockGenerator.CreateAlbum({ id: 1 })
        const mockResponse = album1
        const expectedResult = album1.id

        let nextState = reducer({}, actions.fetchAlbumDetailSuccess(mockResponse))

        expect(nextState).toBeTruthy()
        expect(nextState.detail).toBeTruthy()
        expect(nextState.detail).toEqual(expectedResult)
    })

    it('should add favorite album', () => {
        const album1 = mockGenerator.CreateAlbum({ id: 1 })
        const album2 = mockGenerator.CreateAlbum({ id: 2 })
        const expectedResult = [ album2.id, album1.id ]

        let nextState = reducer({}, actions.addFavoriteAlbum(album1))
        nextState = reducer(nextState, actions.addFavoriteAlbum(album2))
        nextState = reducer(nextState, actions.addFavoriteAlbum(album1))

        expect(nextState).toBeTruthy()
        expect(nextState.favoriteAlbums).toBeTruthy()
        expect(nextState.favoriteAlbums).toEqual(expectedResult)
    })

    it('should remove favorite album', () => {
        const album1 = mockGenerator.CreateAlbum({ id: 1 })
        const album2 = mockGenerator.CreateAlbum({ id: 2 })
        const album3 = mockGenerator.CreateAlbum({ id: 3 })
        const expectedResult = [ album2.id ]
        let nextState = { favoriteAlbums: [ album2.id, album1.id ] }

        nextState = reducer(nextState, actions.removeFavoriteAlbum(album1))
        nextState = reducer(nextState, actions.removeFavoriteAlbum(album3))

        expect(nextState).toBeTruthy()
        expect(nextState.favoriteAlbums).toBeTruthy()
        expect(nextState.favoriteAlbums).toEqual(expectedResult)
    })
})