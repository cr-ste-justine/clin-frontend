/* eslint-disable */

import {
  all, put, takeLatest, select,
} from 'redux-saga/effects';
import { find, cloneDeep } from 'lodash';


import * as actions from '../actions/type';
import Api, { ApiError } from '../helpers/api';


function* fetchSchema() {
  try {
    const schemaResponse = yield Api.getVariantSchema();
    if (schemaResponse.error) {
      throw new ApiError(schemaResponse.error);
    }

    yield put({ type: actions.VARIANT_SCHEMA_SUCCEEDED, payload: schemaResponse.payload.data });
  } catch (e) {
    yield put({ type: actions.VARIANT_SCHEMA_FAILED, payload: e });
  }
}

function* searchVariantsForPatient(action) {
  try {
    const {
      patient, statement, query, group, index, limit,
    } = action.payload;
    const variantResponse = yield Api.searchVariantsForPatient(patient, statement, query, group, index, limit);
    if (variantResponse.error) {
      throw new ApiError(variantResponse.error);
    }
    yield put({ type: actions.PATIENT_VARIANT_SEARCH_SUCCEEDED, payload: variantResponse.payload.data });
  } catch (e) {
    yield put({ type: actions.PATIENT_VARIANT_SEARCH_FAILED, payload: e });
  }
}

function* undo() {
  const { activeQuery, draftQueries } = yield select(state => state.variant);
  const { details } = yield select(state => state.patient);
  const query = find(draftQueries, { key: activeQuery });

  if (query) {
    const payload = {
      patient: details.id,
      statement: draftQueries,
      query: query.key,
      group: 'impact',
      index: 0,
      limit: 25,
    };
    yield put({ type: actions.PATIENT_VARIANT_SEARCH_REQUESTED, payload });
  }
}

function* watchVariantSchemaFetch() {
  yield takeLatest(actions.VARIANT_SCHEMA_REQUESTED, fetchSchema);
}

function* watchVariantSearch() {
  yield takeLatest(actions.PATIENT_VARIANT_SEARCH_REQUESTED, searchVariantsForPatient);
}

function* watchUndo() {
  yield takeLatest(actions.PATIENT_VARIANT_UNDO, undo);
}

function* watchGetStatements() {
  yield takeLatest(actions.PATIENT_VARIANT_GET_STATEMENTS_REQUESTED, getStatements);
}

function* watchCreateStatement() {
  yield takeLatest(actions.PATIENT_VARIANT_CREATE_STATEMENT_REQUESTED, createStatement);
}

function* watchUpdateStatement() {
  yield takeLatest(actions.PATIENT_VARIANT_UPDATE_STATEMENT_REQUESTED, updateStatement);
}

function* watchDuplicateStatement() {
  yield takeLatest(actions.PATIENT_VARIANT_DUPLICATE_STATEMENT_REQUESTED, duplicateStatement);
}

function* watchDeleteStatement() {
  yield takeLatest(actions.PATIENT_VARIANT_DELETE_STATEMENT_REQUESTED, deleteStatement);
}

function* watchSelectStatement() {
    yield takeLatest(actions.PATIENT_VARIANT_SELECT_STATEMENT_REQUESTED, selectStatement);
}

function* getStatements(action) {
  try {
    const statementResponse = yield Api.getStatements();
    if (statementResponse.error) {
      throw new ApiError(statementResponse.error);
    }
    const payload = {
        newKey: action.payload.newKey,
        response: statementResponse.payload.data,
    };
    yield put({ type: actions.PATIENT_VARIANT_GET_STATEMENTS_SUCCEEDED, payload });
    const { draftQueries } = yield select(state => state.variant);

    const newActiveQueryKey = draftQueries[(draftQueries.length - 1)].key
    yield put( { type: actions.PATIENT_VARIANT_QUERY_SELECTION, payload: { key: newActiveQueryKey } });
    if (draftQueries) {
      const { details } = yield select(state => state.patient);
      const payload = {
        patient: details.id,
        statement: draftQueries,
        query: newActiveQueryKey,
      };
      yield put({type: actions.PATIENT_VARIANT_SEARCH_REQUESTED, payload});
    }

  } catch (e) {
    yield put({ type: actions.PATIENT_VARIANT_GET_STATEMENTS_FAILED, payload: e });
  }
}

function* createStatement(action) {
    try {
        const queries = action.payload.newStatement.queries
        const title = action.payload.newStatement.title
        const description = action.payload.newStatement.description
        const statementResponse = yield Api.createStatement(queries, title, description)
        if (statementResponse.error) {
            throw new ApiError(statementResponse.error);
        }

        const newKey = statementResponse.payload.data.data.id
        yield put ( {type: actions.PATIENT_VARIANT_GET_STATEMENTS_REQUESTED, payload: { newKey } });
    } catch (e) {
        yield put({type: actions.PATIENT_VARIANT_CREATE_STATEMENT_FAILED, payload: e});
    }

}

function* updateStatement(action) {
    try {
        const statementKey = action.payload.id
        const {draftQueries, statements} = yield select(state => state.variant);
        const activeStatement = statements.find((hit) => hit._id === statementKey);
        if (!activeStatement) {
          throw new Error('Statement not found');
        }

        const title = action.payload.title ? action.payload.title : activeStatement._source.title
        const description = activeStatement._source.description
        const isDefault = action.payload.switchCurrentStatementToDefault ? true : activeStatement._source.isDefault
        const statementResponse = yield Api.updateStatement(statementKey, draftQueries, title, description, isDefault);
        if (statementResponse.error) {
            throw new ApiError(statementResponse.error);
        }

        yield put({ type: actions.PATIENT_VARIANT_UPDATE_STATEMENT_SUCCEEDED, payload: {} });
        yield put ( {type: actions.PATIENT_VARIANT_GET_STATEMENTS_REQUESTED, payload: {} });
    } catch (e) {
        yield put({ type: actions.PATIENT_VARIANT_UPDATE_STATEMENT_FAILED, payload: e });
    }
}

function* duplicateStatement(action) {
  try {
    const statementKey = action.payload.id
    const { statements} = yield select(state => state.variant);
    const activeStatement = statements.find((hit) => hit._id === statementKey);
    if (!activeStatement) {
      throw new Error('Statement not found');
    }

    const statementResponse = yield Api.createStatement(
      JSON.parse(activeStatement._source.queries) || [],
      `${activeStatement._source.title} Copy` ,
      `${activeStatement._source.description}`
    );
    if (statementResponse.error) {
      throw new ApiError(statementResponse.error);
    }

    yield put({ type: actions.PATIENT_VARIANT_DUPLICATE_STATEMENT_SUCCEEDED, payload: {} });
    yield put({ type: actions.PATIENT_VARIANT_GET_STATEMENTS_REQUESTED, payload: {} });
  } catch (e) {
    yield put({ type: actions.PATIENT_VARIANT_DUPLICATE_STATEMENT_FAILED, payload: e });
  }
}

function* deleteStatement(action) {
    try {
      const statementKey = action.payload.id;
      const statementResponse = yield Api.deleteStatement(statementKey);
      if (statementResponse.error) {
          throw new ApiError(statementResponse.error);
      }
      yield put({ type: actions.PATIENT_VARIANT_DELETE_STATEMENT_SUCCEEDED, payload: {} });
      yield put({ type: actions.PATIENT_VARIANT_GET_STATEMENTS_REQUESTED, payload: {} });
    } catch (e) {
        yield put({ type: actions.PATIENT_VARIANT_DELETE_STATEMENT_FAILED, payload: e });
    }
}

function* selectStatement(action) {
    try {
        const statementKey = action.payload.id
        yield put({type: actions.PATIENT_VARIANT_STATEMENT_SELECTION, payload: {key: statementKey}});
        const {draftQueries} = yield select(state => state.variant);
        const newActiveQueryKey = draftQueries[(draftQueries.length - 1)].key
        yield put( { type: actions.PATIENT_VARIANT_QUERY_SELECTION, payload: { key: newActiveQueryKey } });
        if (draftQueries) {
            const {details} = yield select(state => state.patient);
            const payload = {
                patient: details.id,
                statement: draftQueries,
                query: newActiveQueryKey,
            };
            yield put({type: actions.PATIENT_VARIANT_SEARCH_REQUESTED, payload});
        }

    } catch (e) {
        yield put({ type: actions.PATIENT_VARIANT_SELECT_STATEMENT_FAILED, payload: e });
    }
}

export default function* watchedVariantSagas() {
  yield all([
    watchVariantSchemaFetch(),
    watchVariantSearch(),
    watchUndo(),
    watchGetStatements(),
    watchCreateStatement(),
    watchUpdateStatement(),
    watchDuplicateStatement(),
    watchDeleteStatement(),
    watchSelectStatement(),
  ]);
}
