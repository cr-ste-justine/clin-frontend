import { message } from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';
import {
  all, put, select, takeLatest,
} from 'redux-saga/effects';
import {
  NANUQ_EXPORT_FAILED, NANUQ_EXPORT_INVALID, NANUQ_EXPORT_REQUESTED, NANUQ_EXPORT_SUCCEEDED,
} from '../actions/type';
import { generateExport } from '../helpers/nanuq/nanuq';
import { PrescriptionData } from '../helpers/search/types';

function downloadJSONFile(content: string, filename: string) {
  const fileBlob = new Blob([content], { type: 'text/json' });
  const downloadLinkElement = window.document.createElement('a');
  downloadLinkElement.href = window.URL.createObjectURL(fileBlob);
  downloadLinkElement.download = filename;
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
}

function* generateNanuqReport(action: {type: 'NANUQ_EXPORT_REQUESTED', payload: string[]}) {
  const hideMessage = message.loading(intl.get('screen.patientsearch.nanuqexport.process'));
  const patients: PrescriptionData[] = yield select((state: any) => state.search.patient.results);
  const selectedPatients = patients.filter((p: PrescriptionData) => action.payload.includes(p.id));
  try {
    const report = generateExport(selectedPatients);
    downloadJSONFile(JSON.stringify(report, null, 2), `${moment().format('yyyy-MM-DD')}-clin-nanuq.json`);
    yield put({ type: NANUQ_EXPORT_SUCCEEDED });
  } catch (e) {
    if (e.message === 'invalid_data') {
      yield put({ type: NANUQ_EXPORT_INVALID });
    } else {
      yield put({ type: NANUQ_EXPORT_FAILED });
    }
  }
  hideMessage();
}

function* watchGenerateNanuqReport() {
  yield takeLatest(NANUQ_EXPORT_REQUESTED, generateNanuqReport);
}

export default function* watchedNanuqReportSagas() {
  yield all([watchGenerateNanuqReport()]);
}
