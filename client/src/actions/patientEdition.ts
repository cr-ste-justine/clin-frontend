import { Patient } from '../helpers/fhir/types';
import * as actions from './type';

type Action = (...args: any) => {type: keyof typeof actions, payload?: any};

export const editPatient: Action = (patient: Patient) => (
  {
    type: actions.PATIENT_EDITION_REQUESTED,
    payload: { patient },
  }
);
