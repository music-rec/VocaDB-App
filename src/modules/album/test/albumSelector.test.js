import {
    selectAlbum,
    selectLatestAlbums,
    selectAlbumEntity,
    selectAlbumDetail } from './../albumSelector'
import * as mockGenerator from './../../../helper/mockGenerator'

describe('Test album selector', () => {

    let state;
    let entities;
    let album1;
    let album2;

    beforeEach(() => {

        album1 = mockGenerator.CreateAlbum({ id: 1 })
        album2 = mockGenerator.CreateAlbum({ id: 2 })

        entities = {
            albums: {
                '1': album1,
                '2': album2
            }
        }

        state = {
            entities,
            album: {
                all: [],
                detail: 0
            }
        }
    });


    it('should return album state correctly', () => {
        const actualResult = selectAlbum()(state);
        expect(actualResult).toBeTruthy()
        expect(actualResult).toEqual(state.album)
    })

    it('should return album entity state correctly', () => {
        const actualResult = selectAlbumEntity()(state);
        expect(actualResult).toBeTruthy()
        expect(actualResult).toEqual(entities.albums)
    })

    it('should return latest albums correctly', () => {
        state.album.all = [ album2.id, album1.id ]

        const actualResult = selectLatestAlbums()(state);
        const expectedResult = [ album2, album1 ];

        expect(actualResult).toBeTruthy();
        expect(actualResult).toEqual(expectedResult)
    })

    it('should return empty of latest albums', () => {
        const actualResult = selectLatestAlbums()(state);
        const expectedResult = [];

        expect(actualResult).toBeTruthy();
        expect(actualResult).toEqual(expectedResult)
    })

    it('should return empty of latest albums when entities is undefined', () => {
        state.entities = undefined

        const actualResult = selectLatestAlbums()(state);
        const expectedResult = [];

        expect(actualResult).toBeTruthy();
        expect(actualResult).toEqual(expectedResult)
    })

    it('should not return undefined album when not found in entities', () => {
        state.album.all = [ album2.id, album1.id ]
        state.entities = { albums: { '2': album2 } }

        const actualResult = selectLatestAlbums()(state);
        const expectedResult = [ album2 ];

        expect(actualResult).toBeTruthy();
        expect(actualResult).toEqual(expectedResult)
    })

    it('should return album detail correctly', () => {
        state.album.detail = album1.id

        const actualResult = selectAlbumDetail()(state);
        const expectedResult = album1;

        expect(actualResult).toBeTruthy();
        expect(actualResult).toEqual(expectedResult)
    })
})