import { Request, Response } from 'express';
import { NextFunction } from 'express-async-router';

import { removeMarkup } from './users';


describe('removeMarkup middleware', () => {
  it('should remove markup from request body fields', () => {
    const next: NextFunction = jest.fn();
    const mockRequest = {
      body: {
        markup: '<script>alert("hi")</script>',
        notMarkup: 'I like to put cat pics on Calebs desktop',
      },
    } as Request;
    removeMarkup(mockRequest, {} as Response, next);
    expect(mockRequest.body.markup).toEqual('');
    expect(mockRequest.body.notMarkup).toEqual('I like to put cat pics on Calebs desktop');
    expect(next).toHaveBeenCalled;
  });
});
