import { IncomingMessage } from 'http';

import axios from 'axios';
import absoluteUrl from 'next-absolute-url';

export const createAxiosInstance = (req: IncomingMessage | null = null) => {
  const origin = absoluteUrl(req).origin;

  return axios.create({
    baseURL: origin,
    withCredentials: true,
    headers: {
      cookie: req.headers.cookie || '',
    },
  });
};

export default createAxiosInstance;
