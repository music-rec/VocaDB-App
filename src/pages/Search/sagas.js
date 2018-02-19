import { put, takeLatest, call } from 'redux-saga/effects'
import * as actions from './actions'
import api from './../../api'
import * as globalActions from './../../actions'

const searchEntries = function* searchEntries(action) {
    try {
        const response = yield call(api.entries.find, { 'query': action.payload.query, 'sort': 'AdditionDate', 'fields': 'MainPicture' });
        yield put(actions.searchEntriesSuccess(response.items));
    } catch (e) {
        yield put(globalActions.requestError(e));
    }
}

const searchSaga = function* searchSagaAsync() {
    yield takeLatest(actions.searchEntries, searchEntries)
}

export { searchEntries }

export default searchSaga
