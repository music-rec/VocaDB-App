import { fetchTagDetail, fetchTopSongsByTag, fetchTopArtistsByTag, fetchTopAlbumsByTag } from './../tagSagas'
import api from './../tagApi'
import { call, put } from 'redux-saga/effects'
import * as actions from './../tagActions'
import * as appActions from './../../../app/appActions'
import * as mock from './../../../helper/mockGenerator'

describe('Test tag sagas', () => {
    it('Should fetch tag detail success', () => {
        const action = actions.fetchTagDetail(1)
        const gen = fetchTagDetail(action)

        expect(gen.next().value).toEqual(call(api.getTag, 1));

        const mockTagItem = mock.CreateTag()
        expect(gen.next(mockTagItem).value).toEqual(put(actions.fetchTagDetailSuccess(mockTagItem)));

        expect(gen.next().done).toBeTruthy();
    })

    it('Should fetch top songs by tag', () => {
        const action = actions.fetchTopSongsByTag(1)
        const gen = fetchTopSongsByTag(action)

        expect(gen.next().value).toEqual(call(api.getTopSongsByTag, 1));

        const song1 = mock.CreateSong({ id: 1 })
        const song2 = mock.CreateSong({ id: 1 })
        const mockResponse = { items: [ song1, song2 ] }
        expect(gen.next(mockResponse).value).toEqual(put(actions.fetchTopSongsByTagSuccess(mockResponse.items)));

        expect(gen.next().done).toBeTruthy();
    })

    it('Should fetch top artists by tag', () => {
        const action = actions.fetchTopArtistsByTag(1)
        const gen = fetchTopArtistsByTag(action)

        expect(gen.next().value).toEqual(call(api.getTopArtistsByTag, 1));

        const artist1 = mock.CreateArtist({ id: 1 })
        const artist2 = mock.CreateArtist({ id: 1 })
        const mockResponse = { items: [ artist1, artist2 ] }
        expect(gen.next(mockResponse).value).toEqual(put(actions.fetchTopArtistsByTagSuccess(mockResponse.items)));

        expect(gen.next().done).toBeTruthy();
    })

    it('Should fetch top albums by tag', () => {
        const action = actions.fetchTopAlbumsByTag(1)
        const gen = fetchTopAlbumsByTag(action)

        expect(gen.next().value).toEqual(call(api.getTopAlbumsByTag, 1));

        const album1 = mock.CreateAlbum({ id: 1 })
        const album2 = mock.CreateAlbum({ id: 1 })
        const mockResponse = { items: [ album1, album2 ] }
        expect(gen.next(mockResponse).value).toEqual(put(actions.fetchTopAlbumsByTagSuccess(mockResponse.items)));

        expect(gen.next().done).toBeTruthy();
    })

    it('Should return error when no id', () => {
        const action = actions.fetchTagDetail()
        const gen = fetchTagDetail(action)

        expect(gen.next().value).toEqual(put(appActions.requestError(new Error("id is undefined"))));

        expect(gen.next().done).toBeTruthy();
    })
})