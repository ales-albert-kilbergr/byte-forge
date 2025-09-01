import { pgSqlTag } from './pg-sql-tag';

describe('pgSqlTag', () => {
  it('should work', () => {
    expect(pgSqlTag()).toEqual('pg-sql-tag');
  });
});
