import { IncomingMessage } from 'http';

import axios from 'axios';
import absoluteUrl from 'next-absolute-url';

export const createAxiosInstance = (req: IncomingMessage | null = null) => {
  return axios.create({
    baseURL: absoluteUrl(req).origin,
    withCredentials: true,
    headers: {
      cookie: req?.headers.cookie || '',
    },
  });
};

export default createAxiosInstance;
