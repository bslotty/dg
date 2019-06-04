import { UTCDatePipe } from './utcdate.pipe';

describe('UTCDatePipe', () => {
  it('create an instance', () => {
    const pipe = new UTCDatePipe();
    expect(pipe).toBeTruthy();
  });
});
