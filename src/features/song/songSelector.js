import { createSelector } from 'reselect';
import { selectNav } from './../../app/appSelector';
import Routes from './../../app/appRoutes';
import { selectArtistEntity, convertArtistIds } from './../artist/artistSelector';
import { selectTagEntity, convertTagIds } from './../tag/tagSelector';
import { durationHoursHelper, filterByHelper, vocalistHelper } from './SongRanking/SongRankingHelper';
import { convertAlbumIds, selectAlbumEntity } from './../album/albumSelector';
import { selectDefaultPVService } from './../user/userSelector';
import { defaultSearchParams } from './songConstant';

export const transformSong = (entry) => {

    if(!entry) {
        return {}
    }

    let image = 'https://via.placeholder.com/350x150/000000/ffffff?text=NO_IMAGE';

    if(entry.thumbUrl) {
        image = entry.thumbUrl.replace('http:', 'https:').replace(/tn-skr\d?/gm, 'tn');
    } else if(entry.mainPicture && entry.mainPicture.urlThumb) {
        image = entry.mainPicture.urlThumb.replace('http:', 'https:').replace(/tn-skr\d?/gm, 'tn');
    }

    return {
        ...entry,
        image
    }
}

export const convertSongIds = (entryIds, entryEntity) => (entryIds)? entryIds
    .filter(id => (id != undefined && entryEntity[id.toString()]))
    .map(id => entryEntity[id.toString()])
    .map(transformSong) : []


export const selectSong = () => state => state.song
export const selectSongEntity = () => state => (state.entities && state.entities.songs)? state.entities.songs : {}
export const selectEntities = () => state => state.entities
export const selectNoResult = () => createSelector(
    selectSong(),
    song => song.noResult
)

export const selectFilterArtists = () => createSelector(
    selectSearchParams(),
    selectArtistEntity(),
    (searchParams, artistEntity) => {
        if(!searchParams || !searchParams.artistId || !artistEntity) {
            return []
        }

        return convertArtistIds(searchParams.artistId, artistEntity);
    }
)
export const selectHighlightedIds = () => createSelector(
    selectSong(),
    song => song.highlighted
)
export const selectLatestSongIds = () => createSelector(
    selectSong(),
    song => song.all
)
export const selectFollowedSongIds = () => createSelector(
    selectSong(),
    song => song.followed
)
export const selectSongDetailId = () => createSelector(
    selectNav(),
    nav => (nav
        && nav.routes[nav.index]
        && nav.routes[nav.index].routeName === Routes.SongDetail)? nav.routes[nav.index].params.id : 0
)

export const selectHighlighted = () => createSelector(
    selectHighlightedIds(),
    selectSongEntity(),
    convertSongIds
)

export const selectLatestSongs = () => createSelector(
    selectLatestSongIds(),
    selectSongEntity(),
    convertSongIds
)

export const selectFollowedSongs = () => createSelector(
    selectFollowedSongIds(),
    selectSongEntity(),
    convertSongIds
);

export const selectFavoriteSongIds = () => createSelector(
    selectSong(),
    songState => {
        return (songState.favoriteSongs) ? songState.favoriteSongs : []
    }
)

export const selectFavoriteSongs = () => createSelector(
    selectFavoriteSongIds(),
    selectSongEntity(),
    convertSongIds
)

export const selectSongDetail = () => createSelector(
    selectSongDetailId(),
    selectSongEntity(),
    (songDetailId, songEntity) => transformSong(songEntity[songDetailId.toString()])
)

export const selectOriginalSong = () => createSelector(
    selectSongDetail(),
    selectSongEntity(),
    (songDetail, songEntity) => {
        if(!songEntity || !songDetail || !songDetail.originalVersionId ) {
            return null
        }

        let originalSong = songEntity[songDetail.originalVersionId];

        return (originalSong)? transformSong(originalSong) : null;
    }
)

export const selectAlbums = () => createSelector(
    selectSongDetail(),
    selectAlbumEntity(),
    (songDetail, albumEntity) => (songDetail && songDetail.albums)? convertAlbumIds(songDetail.albums, albumEntity) : []
)

export const selectIsFavoriteSong = () => createSelector(
    selectSong(),
    selectFavoriteSongIds(),
    selectSongDetailId(),
    (songState, favoriteSongIds, songDetailId) => {
        return (favoriteSongIds && favoriteSongIds.indexOf(songDetailId) >=0)? true : false
    }
)

export const selectSelectedFilterTagIds = () => createSelector(
    selectSearchParams(),
    (searchParams) => (searchParams && searchParams.tagId)? searchParams.tagId : []
)

export const selectSelectedFilterTags = () => createSelector(
    selectSelectedFilterTagIds(),
    selectTagEntity(),
    convertTagIds
)


export const selectRankingState = () => createSelector(
    selectSong(),
    (songState) => {
        if(!songState || !songState.ranking) {
            return {
                durationHours: durationHoursHelper.values.Weekly,
                filterBy: filterByHelper.values.NewlyAdded,
                vocalist: vocalistHelper.values.All,
                songs: []
            }
        }

        const ranking = songState.ranking;
        const durationHours = (ranking.durationHours != undefined)? ranking.durationHours : durationHoursHelper.values.Weekly;
        const filterBy = (ranking.filterBy != undefined)? ranking.filterBy : filterByHelper.values.NewlyAdded;
        const vocalist = (ranking.vocalist != undefined)? ranking.vocalist : vocalistHelper.values.All;

        return {
            durationHours,
            filterBy,
            vocalist,
            songs: ranking.songs
        }
    }
)

export const selectRankingResult = () => createSelector(
    selectRankingState(),
    selectSongEntity(),
    (rankingState, songEntity) => {
        if(rankingState && rankingState.songs && songEntity) {
            return convertSongIds(rankingState.songs, songEntity);
        }

        return [];
    }
)

export const selectSearchParams = () => createSelector(
    selectSong(),
    songState => {

        if(!songState || !songState.searchPage || !songState.searchPage.params) {
            return defaultSearchParams
        }

        const searchParams = songState.searchPage.params;

        searchParams.sort = (searchParams.sort)? searchParams.sort : 'Name'
        searchParams.query = (searchParams.query)? searchParams.query : ''

        return searchParams;
    }
)

export const selectSearchResultIds = () => createSelector(
    selectSong(),
    songState => (songState && songState.searchPage && songState.searchPage.results)? songState.searchPage.results : []
)

export const selectSearchResult = () => createSelector(
    selectSearchResultIds(),
    selectSongEntity(),
    convertSongIds
)


export const selectFilterTagIds = () => createSelector(
    selectSearchParams(),
    (searchParams) => {
        console.log(searchParams)
        return (searchParams && searchParams.tagId)? searchParams.tagId : []
    }
)

export const selectFilterTags = () => createSelector(
    selectSearchParams(),
    selectTagEntity(),
    (params, tagEntity) => {
        return convertTagIds(params.tagId, tagEntity)
    }
)


export const selectSelectedSinglePage = () => createSelector(
    selectSong(),
    selectNav(),
    (songState, nav) => {

        if(!songState || !songState.singlePage || !nav || !nav.routes[nav.index]) {
            return { params: {}, results: [] }
        }

        let selectedRoute = nav.routes[nav.index]
        let selectedSinglePage = songState.singlePage[selectedRoute.key]

        if(!selectedSinglePage) {
            return { params: {}, results: [] }
        }

        return selectedSinglePage
    }
)

export const selectSelectedSinglePageParams = () => createSelector(
    selectSelectedSinglePage(),
    (selectedSinglePage) => (selectedSinglePage && selectedSinglePage.params)? selectedSinglePage.params : {}
)

export const selectSelectedSinglePageResults = () => createSelector(
    selectSelectedSinglePage(),
    selectSongEntity(),
    (selectedSinglePage, entity) => {
        return (selectedSinglePage && selectedSinglePage.results)? convertSongIds(selectedSinglePage.results, entity) : []
    }
)

export const selectSelectedNavRoute = () => createSelector(
    selectNav(),
    (nav) => (nav.routes[nav.index])? nav.routes[nav.index] : {}
)

export const selectOriginalPVs = () => createSelector(
    selectSongDetail(),
    (songDetail) => (songDetail && songDetail.pvs && songDetail.pvs.length)? songDetail.pvs.filter(p => p.pvType == 'Original') : []
)

export const selectOtherPVs = () => createSelector(
    selectSongDetail(),
    (songDetail) => (songDetail && songDetail.pvs && songDetail.pvs.length)? songDetail.pvs.filter(p => p.pvType != 'Original') : []
)

export const selectIsPVContainYoutubeService = () => createSelector(
    selectSongDetail(),
    (songDetail) => (songDetail && songDetail.pvs && songDetail.pvs.length && songDetail.pvs.filter(p => p.service.toLowerCase() == 'youtube').length)
)

export const selectPVByDefaultPVService = () => createSelector(
    selectSongDetail(),
    selectDefaultPVService(),
    (songDetail, defaultPVService) => {

        if(!songDetail || !songDetail.pvs || !songDetail.pvs.length || defaultPVService === 'None') {
            return null;
        }

        const pvs = songDetail.pvs;

        if(defaultPVService && defaultPVService != 'Default') {

            let pvsFromSelectedService = pvs.filter(p => p.service === defaultPVService)

            if(pvsFromSelectedService && pvsFromSelectedService.length) {

                let originalPVs = pvsFromSelectedService.filter(p => p.pvType === 'Original');

                if(originalPVs.length) {
                    return originalPVs[0];
                }

                let otherPVs = pvsFromSelectedService.filter(p => p.pvType != 'Original');

                if(otherPVs.length) {
                    return otherPVs[0];
                }

                return pvsFromSelectedService[0];
            }

        }

        const defaultServices = [ "Youtube", "Bilibili", "SoundCloud"];

        for(let i=0;i<defaultServices.length;i++) {
            const service = defaultServices[i];

            let pvsFromSelectedService = pvs.filter(p => p.service === service)

            if(pvsFromSelectedService && pvsFromSelectedService.length) {

                let originalPVs = pvsFromSelectedService.filter(p => p.pvType === 'Original');

                if(originalPVs.length) {
                    return originalPVs[0];
                }

                let otherPVs = pvsFromSelectedService.filter(p => p.pvType != 'Original');

                if(otherPVs.length) {
                    return otherPVs[0];
                }

                return pvsFromSelectedService[0];
            }

        }


    }
)

export const selectAlternateVersion = () => createSelector(
    selectSongDetail(),
    selectSongEntity(),
    (songDetail, songEntity) => (songDetail && songDetail.alternate)? convertSongIds(songDetail.alternate, songEntity) : []
)

export const selectSongsFromCurrentSongShowAll = () => createSelector(
    selectNav(),
    nav => (nav
        && nav.routes[nav.index]
        && nav.routes[nav.index].routeName === Routes.SongShowAll)? nav.routes[nav.index].params.songs : []
)

export const selectSongDetailLikeMatches = () => createSelector(
    selectSongDetail(),
    selectSongEntity(),
    (songDetail, songEntity) => (songDetail && songDetail.related && songDetail.related.likeMatches)? convertSongIds(songDetail.related.likeMatches, songEntity) : []
)


export const selectSongIdFromRelatedPage = () => createSelector(
    selectNav(),
    nav => (nav
        && nav.routes[nav.index]
        && nav.routes[nav.index].routeName === Routes.SongRelated)? nav.routes[nav.index].params.id : 0
)

export const selectSongFromRelatedPage = () => createSelector(
    selectSongIdFromRelatedPage(),
    selectSongEntity(),
    (songId, songEntity) => transformSong(songEntity[songId.toString()])
)

export const selectSongRelated = () => createSelector(
    selectSongFromRelatedPage(),
    selectSongEntity(),
    (song, songEntity) => {

        let songRelated = {
            artistMatches: [],
            likeMatches: [],
            tagMatches: []
        }

        if(!song || !song.related) {
            return songRelated;
        }

        songRelated.artistMatches = (song.related.artistMatches)? convertSongIds(song.related.artistMatches, songEntity) : [];
        songRelated.likeMatches = (song.related.likeMatches)? convertSongIds(song.related.likeMatches, songEntity) : [];
        songRelated.tagMatches = (song.related.tagMatches)? convertSongIds(song.related.tagMatches, songEntity) : [];

        return songRelated;

    }
)