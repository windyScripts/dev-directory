import { Request, Response } from 'express';
import { NextFunction } from 'express-async-router';

import { sanitize } from './users';


describe('middleware for encoding unsafe characters in input fields', () => {
  it('should remove markup from request body fields', () => {
    const next: NextFunction = jest.fn();
    const mockRequest = {
      body: {
        markup: '<script>alert("&hi")</script>',
        notMarkup: 'I like to put cat pics on Calebs desktop',
      },
    } as Request;
    sanitize(mockRequest, {} as Response, next);
    expect(mockRequest.body.markup).toEqual('&lt;script&gt;alert(&quot;&amp;hi&quot;)&lt;/script&gt;');
    expect(mockRequest.body.notMarkup).toEqual('I like to put cat pics on Calebs desktop');
    expect(next).toHaveBeenCalled;
  });
});
