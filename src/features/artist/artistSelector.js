import { createSelector } from 'reselect';
import { selectNav } from './../../app/appSelector';
import Routes from './../../app/appRoutes';
import image from './../../common/assets/images';
import { selectTagEntity, convertTagIds } from './../tag/tagSelector';
import { convertSongIds, selectSongEntity } from './../song/songSelector';
import { convertAlbumIds, selectAlbumEntity } from './../album/albumSelector';
import { convertEventIds, selectReleaseEventEntity } from './../releaseEvent/releaseEventSelector';
import { translateLinkType, translateReverseLinkType } from './artistConstant';
import { defaultSearchParams } from './artistConstant';
import _ from 'lodash';

export const transformArtist = (artist) => {
    if(!artist) {
        return {}
    }

    return {
        ...artist,
        image: (artist.mainPicture && artist.mainPicture.urlSmallThumb) ? artist.mainPicture.urlSmallThumb : image.getArtistUri(artist.id, artist.pictureMime)
    }
}

export const convertArtistIds = (artistIds, artistEntity) => (artistIds)? artistIds
    .filter(id => (id != undefined && artistEntity[id.toString()]))
    .map(id => artistEntity[id.toString()])
    .map(entry => ({
        ...entry,
        image: (entry.mainPicture && entry.mainPicture.urlThumb) ? entry.mainPicture.urlThumb : image.getArtistUri(entry.id, entry.pictureMime)
    })) : []

export const selectArtist = () => state => state.artist
export const selectArtistEntity = () => state => (state.entities && state.entities.artists)? state.entities.artists : {}
export const selectNoResult = () => createSelector(
    selectArtist(),
    artist => artist.noResult
)
export const selectArtistDetailId = () => createSelector(
    selectNav(),
    nav => (nav
        && nav.routes[nav.index]
        && nav.routes[nav.index].routeName === Routes.ArtistDetail)? nav.routes[nav.index].params.id : 0
)
export const selectArtistDetail = () => createSelector(
    selectArtistDetailId(),
    selectArtistEntity(),
    (artistDetailId, artistEntity) => transformArtist(artistEntity[artistDetailId.toString()])
)

export const selectRelations = () => createSelector(
    selectArtistDetail(),
    (artistDetail) => (artistDetail)? artistDetail.relations : {}
)

export const selectLatestSongs = () => createSelector(
    selectRelations(),
    selectSongEntity(),
    (relations, songEntity) => (relations && relations.latestSongs)? convertSongIds(relations.latestSongs, songEntity) : []
)

export const selectPopularSongs = () => createSelector(
    selectRelations(),
    selectSongEntity(),
    // (relations) => (relations)? relations.popularSongs : []
    (relations, songEntity) => (relations && relations.popularSongs)? convertSongIds(relations.popularSongs, songEntity) : []
)

export const selectLatestAlbums = () => createSelector(
    selectRelations(),
    selectAlbumEntity(),
    // (relations) => (relations)? relations.latestAlbums : []
    (relations, albumEntity) => (relations && relations.latestAlbums)? convertAlbumIds(relations.latestAlbums, albumEntity) : []
)

export const selectPopularAlbums = () => createSelector(
    selectRelations(),
    selectAlbumEntity(),
    // (relations) => (relations)? relations.popularAlbums : []
    (relations, albumEntity) => (relations && relations.popularAlbums)? convertAlbumIds(relations.popularAlbums, albumEntity) : []
)

export const selectLatestEvents = () => createSelector(
    selectRelations(),
    selectReleaseEventEntity(),
    // (relations) => (relations)? relations.latestEvents : []
    (relations, eventEntity) => (relations && relations.latestEvents)? convertEventIds(relations.latestEvents, eventEntity) : []
)

export const selectFollowedArtistIds = () => createSelector(
    selectArtist(),
    artistState => {
        return artistState.followed
    }
)

export const selectFollowedArtists = () => createSelector(
    selectArtist(),
    selectArtistEntity(),
    (artistState, artistEntity) => (artistState && artistEntity)? artistState.followed.map(id => artistEntity[id.toString()]) : []
)

export const selectIsFollowedArtist = () => createSelector(
    selectArtist(),
    selectFollowedArtistIds(),
    selectArtistDetailId(),
    (artistState, followedArtistIds, artistDetailId) => {
        return (followedArtistIds && followedArtistIds.indexOf(artistDetailId) >=0)? true : false
    }
)

export const selectArtistLinks = () => createSelector(
    selectArtistDetail(),
    selectArtistEntity(),
    (artistDetail, artistEntity) => {

        if(!artistDetail || !artistDetail.artistLinks || !artistEntity) {
            return null;
        }

        let uniqLinkTypes = _.uniq(artistDetail.artistLinks.map(a => a.linkType));
        let artistGroup =  _.groupBy(artistDetail.artistLinks, a => a.linkType);

        if(!uniqLinkTypes || !uniqLinkTypes.length || !artistGroup) {
            return null;
        }

        return uniqLinkTypes.map(linkType => {
            if(!linkType || !artistGroup[linkType]) {
                return;
            }

            let artists = artistGroup[linkType].filter(a => artistEntity[a.artist]).map(a => transformArtist(artistEntity[a.artist]))

            return {
                linkType: translateLinkType(linkType),
                artists
            }
        });
    }
)

export const selectArtistLinksReverse = () => createSelector(
    selectArtistDetail(),
    selectArtistEntity(),
    (artistDetail, artistEntity) => {

        if(!artistDetail || !artistDetail.artistLinksReverse || !artistEntity) {
            return null;
        }

        let uniqLinkTypes = _.uniq(artistDetail.artistLinksReverse.map(a => a.linkType));
        let artistGroup =  _.groupBy(artistDetail.artistLinksReverse, a => a.linkType);

        if(!uniqLinkTypes || !uniqLinkTypes.length || !artistGroup) {
            return null;
        }

        return uniqLinkTypes.map(linkType => {
            if(!linkType || !artistGroup[linkType]) {
                return;
            }

            let artists = artistGroup[linkType].filter(a => artistEntity[a.artist]).map(a => transformArtist(artistEntity[a.artist]))

            return {
                linkType: translateReverseLinkType(linkType),
                artists
            }
        });
    }
)


export const selectBaseVoicebank = () => createSelector(
    selectArtistDetail(),
    selectArtistEntity(),
    (artistDetail, artistEntity) => (artistDetail && artistDetail.baseVoicebank && artistEntity[artistDetail.baseVoicebank.toString()])?
        transformArtist(artistEntity[artistDetail.baseVoicebank.toString()]) : null
)

export const selectSearchParams = () => createSelector(
    selectArtist(),
    state => {

        if(!state || !state.searchPage || !state.searchPage.params) {
            return defaultSearchParams
        }

        const searchParams = state.searchPage.params;

        searchParams.sort = (searchParams.sort)? searchParams.sort : 'Name'
        searchParams.query = (searchParams.query)? searchParams.query : ''

        return searchParams;
    }
)

export const selectSearchResultIds = () => createSelector(
    selectArtist(),
    eventState => {
        let a = (eventState && eventState.searchPage && eventState.searchPage.results)? eventState.searchPage.results : []
        return a
    }
)

export const selectSearchResult = () => createSelector(
    selectSearchResultIds(),
    selectArtistEntity(),
    convertArtistIds
)

export const selectFilterTagIds = () => createSelector(
    selectSearchParams(),
    (searchParams) => {
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

export const selectFollowedArtistsWithLatestSongs = () => createSelector(
    selectFollowedArtists(),
    selectSongEntity(),
    (artists, songEntity) => {
        if(!artists || !songEntity) {
            return [];
        }

        const a = artists.filter(a => a.relations && a.relations.latestSongs)
            .map(a => {

                a = transformArtist(a);

                return {
                    id: a.id,
                    name: a.name,
                    image: a.image,
                    latestSongs: convertSongIds(a.relations.latestSongs, songEntity)
                        .map(s => ({
                            id: s.id,
                            name: s.name,
                            artistString: s.artistString,
                            image: s.image,
                            songType: s.songType,
                            pvs: s.pvs
                        }))
                }
            });

        return a;
    }
)

export const selectSearchResultModal = () => createSelector(
    selectArtist(),
    selectArtistEntity(),
    (artistState, artistEntity) => {
        if(!artistState || !artistEntity || !artistState.searchResultModal) {
            return [];
        }

        return convertArtistIds(artistState.searchResultModal, artistEntity);
    }
)