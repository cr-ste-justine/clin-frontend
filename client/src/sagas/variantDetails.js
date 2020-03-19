import {
  all, put, takeLatest,
} from 'redux-saga/effects';

import * as actionTypes from '../actions/type';
// import * as actions from '../actions/app';
import Api, { ApiError } from '../helpers/api';

function* fetchVariantDetails(action) {
  const { payload } = action;
  try {
    yield put({ type: actionTypes.VARIANT_ID_SET, payload });
    const variantDetailsResponse = yield Api.getVariantDetails(payload);
    if (variantDetailsResponse.error) {
      throw new ApiError(variantDetailsResponse.error);
    }

    yield put({ type: actionTypes.VARIANT_DETAILS_SUCCEEDED, payload: variantDetailsResponse.payload.data.data });
  } catch (e) {
    yield put({ type: actionTypes.VARIANT_DETAILS_FAILED, payload: e });
  }
}

function* watchVariantDetailsFetch() {
  yield takeLatest(actionTypes.VARIANT_DETAILS_REQUESTED, fetchVariantDetails);
}

export default function* watchedVariantDetailsSagas() {
  yield all([
    watchVariantDetailsFetch(),
  ]);
}
