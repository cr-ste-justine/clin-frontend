import { call, put, all, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/type';

export function* fetchUser(action) {
    yield put({type: actions.START_LOADING_ANIMATION});
    try {
        const user = yield {};
        yield all([
            put({type: actions.USER_FETCH_SUCCEEDED, user: user}),
            put({type: actions.STOP_LOADING_ANIMATION})
        ]);
    } catch (e) {
        yield all([
            put({type: actions.USER_FETCH_FAILED, message: e.message}),
            put({type: actions.STOP_LOADING_ANIMATION})
        ]);
    }
}

function* watchFetchUser() {
    yield takeLatest(actions.USER_FETCH_REQUESTED, fetchUser);
}

export default {
    loadUser: watchFetchUser,
};
