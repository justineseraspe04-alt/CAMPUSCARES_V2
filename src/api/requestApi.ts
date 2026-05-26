import {
  getRequestHistory,
  submitRequest,
  type RequestPayload,
  type StudentRequestRecord,
} from './recipientApi';

export type { RequestPayload as StudentRequestPayload, StudentRequestRecord };

export { submitRequest, getRequestHistory };
