import * as actions from './type';

type Action = (...args: any) => {type: keyof typeof actions, payload?: any};

export const createRequest: Action = (batch: any, openedPrescriptionId: string | undefined) => ({
  type: actions.CREATE_PATIENT_REQUEST_REQUESTED,
  payload: {
    batch,
    openedPrescriptionId,
  },
});

export const resetStatus: Action = () => ({
  type: actions.CREATE_PATIENT_REQUEST_STATUS_RESET,
});
