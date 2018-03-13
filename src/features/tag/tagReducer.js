import { createReducer } from 'redux-act'
import * as actions from './tagActions';

export const defaultState = {
    detail: 0,
    topSongs: [],
    topArtists: [],
    topAlbums: []
}

const reducer = createReducer({
    [actions.fetchTagDetailSuccess]: (state, payload) => {
        return { ...state, detail: payload.result }
    },
    [actions.fetchTopSongsByTagSuccess]: (state, payload) => {
        return { ...state, topSongs: payload.result }
    },
    [actions.fetchTopArtistsByTagSuccess]: (state, payload) => {
        return { ...state, topArtists: payload.result }
    },
    [actions.fetchTopAlbumsByTagSuccess]: (state, payload) => {
        return { ...state, topAlbums: payload.result }
    }
}, defaultState)

export default reducer