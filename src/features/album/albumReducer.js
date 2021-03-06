import { createReducer } from 'redux-act';
import * as actions from './albumActions';
import merge from 'deepmerge';
import _ from 'lodash';
import { defaultSearchParams } from './albumConstant';

export const defaultState = {
    all: [],
    top: [],
    detail: 0,
    searchResult: [],
    favoriteAlbums: [],
    searchParams: defaultSearchParams,
    noResult: false,
    searchPage: {
        params: {},
        results: []
    },
    singlePage: {

    }
}

const reducer = createReducer({
    [actions.fetchSearchAlbumsSuccess]: (state, payload) => {

        if(payload.result.length === 0) {
            return { ...state, noResult: true }
        }

        if(payload.append) {
            let newSearchResult = state.searchResult;
            newSearchResult = newSearchResult.concat(payload.result);

            return { ...state, searchResult: newSearchResult, noResult: false }
        }
        return { ...state, searchResult: payload.result, noResult: false }
    },
    [actions.fetchLatestAlbumsSuccess]: (state, payload) => {
        return { ...state, all: payload.result }
    },
    [actions.fetchTopAlbumsSuccess]: (state, payload) => {
        return { ...state, top: payload.result }
    },
    [actions.fetchAlbumDetailSuccess]: (state, payload) => {
        return { ...state, detail: payload.result }
    },
    [actions.addFavoriteAlbum]: (state, payload) => {
        const album = payload.album;

        if(!album) {
            return state
        }

        let currentFavoriteAlbums = (state.favoriteAlbums)? state.favoriteAlbums : []

        if(currentFavoriteAlbums.indexOf(album.id) >= 0) {
            return state
        }

        currentFavoriteAlbums.unshift(album.id)

        return { ...state, favoriteAlbums: currentFavoriteAlbums }
    },
    [actions.removeFavoriteAlbum]: (state, payload) => {
        const album = payload.album;

        if(!album) {
            return state
        }

        let currentFavoriteAlbums = state.favoriteAlbums.filter(id => id != album.id)

        return { ...state, favoriteAlbums: currentFavoriteAlbums }
    },
    [actions.onSearching]: (state, payload) => {

        let newState = Object.assign({}, state);

        if(!newState.searchPage) {
            newState.searchPage = {
                params: defaultSearchParams,
                results: []
            }
        }

        let params = Object.assign({}, state.searchPage.params)

        if(!params) {
            newState.searchPage.params = defaultSearchParams
        } else {
            newState.searchPage.params = params;
        }

        newState.searchPage.params.query = (payload.text)? payload.text : '';
        newState.searchPage.params.start = 0;

        return newState;
    },
    [actions.updateSearchParams]: (state, payload) => {

        if(!payload.name) {
            return state;
        }

        let newState = Object.assign({}, state);

        if(newState.searchPage && newState.searchPage.params) {
            newState.searchPage.params[payload.name] = payload.value;
            newState.searchPage.params.start = 0;
        } else {
            let params = defaultSearchParams
            params[payload.name] =  payload.value;
            newState.searchPage = {
                params,
                results: []
            }
        }

        return newState
    },
    [actions.removeSearchParamsArray]: (state, payload) => {
        if(!payload.value || !payload.name || !state.searchPage || !state.searchPage.params || !state.searchPage.params[payload.name]) {
            return state;
        }

        let newState = Object.assign({}, state)
        let params = Object.assign({}, state.searchPage.params)
        newState.searchPage.params = params;

        newState.searchPage.params[payload.name] = newState.searchPage.params[payload.name].filter(v => v != payload.value);
        newState.searchPage.params.start = 0;

        return newState
    },
    [actions.addSearchParamsArray]: (state, payload) => {
        if(!payload.value || !payload.name) {
            return state;
        }

        let newState = Object.assign({}, state)


        if(!newState.searchPage) {
            newState.searchPage = {
                params: defaultSearchParams,
                results: []
            }
        }

        let params = Object.assign({}, state.searchPage.params)

        if(!params) {
            newState.searchPage.params = defaultSearchParams
        } else {
            newState.searchPage.params = params;
        }

        if(newState.searchPage.params[payload.name]) {
            newState.searchPage.params[payload.name] = _.union(newState.searchPage.params[payload.name], [ payload.value] )
            newState.searchPage.params.start = 0;
        } else {
            newState.searchPage.params[payload.name] = [ payload.value ]
        }

        return newState;
    },
    [actions.addSearchResult]: (state, payload) => {
        if(!payload.result) {
            return state;
        }

        let newState = { ...state }

        if(newState.searchPage && newState.searchPage.results) {
            newState.searchPage.results =  _.union(newState.searchPage.results, payload.result )
        } else {
            newState.searchPage = {
                results: payload.result
            }
        }

        return newState;
    },
    [actions.setSearchResult]: (state, payload) => {

        if(!payload.result) {
            return state;
        }

        let newState = { ...state }

        if(newState.searchPage && newState.searchPage.results) {
            newState.searchPage.results = payload.result;
        } else {
            newState.searchPage = {
                results: payload.result
            }
        }

        return newState;
    },
    [actions.fetchMoreSearchResult]: (state) => {

        let newState = { ...state }

        if(!newState.searchPage) {
            return {
                ...newState,
                searchPage: { params: { start: 0 }, results: [] }
            }
        }

        let start = (newState.searchPage.results)? newState.searchPage.results.length : 0;

        newState.searchPage.params = {
            ...newState.searchPage.params,
            start
        }

        return newState
    },
    [actions.addParamsToPageId]: (state, payload) => {

        if(!payload.pageId || !payload.params) {
            return state;
        }

        let singlePage = {}

        if(state.singlePage) {
            singlePage = Object.assign({}, state.singlePage)
        }

        let singlePageSelected = singlePage[payload.pageId]

        if(singlePageSelected) {
            singlePage[payload.pageId].params = { ...payload.params, start: 0 }
            return { ...state, singlePage }
        }

        singlePage[payload.pageId] = {
            params: { ...payload.params, start: 0 }
        }

        return { ...state, singlePage }
    },
    [actions.fetchMoreResultOnPageId]: (state, payload) => {

        if(!payload || !payload.pageId) {
            return state;
        }

        let singlePage = {}

        if(state.singlePage) {
            singlePage = Object.assign({}, state.singlePage)
        }

        let singlePageSelected = singlePage[payload.pageId]

        let start = (singlePageSelected.results)? singlePageSelected.results.length : 0;

        if(singlePageSelected) {
            singlePage[payload.pageId].params = { ...singlePage[payload.pageId].params, start }
            return { ...state, singlePage }
        }

        singlePage[payload.pageId] = {
            params: { ...payload.params, start }
        }

        return { ...state, singlePage }

    },
    [actions.addResultToPageId]: (state, payload) => {
        if(!payload.pageId || !payload.result) {
            return state;
        }

        let singlePage = Object.assign({}, state.singlePage)
        singlePage[payload.pageId].results = _.union(singlePage[payload.pageId].results, payload.result )

        return { ...state, singlePage }
    },
    [actions.setResultToPageId]: (state, payload) => {

        if(!payload.pageId || !payload.result) {
            return state;
        }

        let singlePage = Object.assign({}, state.singlePage)
        singlePage[payload.pageId].results = payload.result

        return { ...state, singlePage }
    },
    [actions.clearSinglePageState]: (state) => {
        return { ...state, singlePage: {} }
    },
    [actions.clearFilter]: (state) => {
        let newState = { ...state }
        newState.searchPage.params = defaultSearchParams;
        return newState;
    },
    [actions.mergeFavoriteAlbums]: (state, payload) => {
        if(!payload || !payload.result) {
            return state;
        }

        const newState = Object.assign({}, state);

        newState.favoriteAlbums = _.union(newState.favoriteAlbums, payload.result )

        return newState;
    }

}, defaultState)

export default reducer
