import { expectTypeOf } from 'expect-type';

import { Failure, Result, Success } from './result';

describe('(Unit) Result', () => {
  describe('when creating a success', () => {
    it('should return a success opaque', () => {
      // Arrange & Act
      const success = Result.success(123);
      // Assert
      expectTypeOf(success).toEqualTypeOf<Result<number, never>>();
    });
  });

  describe('when creating a failure', () => {
    it('should return a failure opaque', () => {
      // Arrange & Act
      const failure = Result.failure('error');
      // Assert
      expectTypeOf(failure).toEqualTypeOf<Result<never, string>>();
    });
  });

  describe('when checking if a result is a success', () => {
    it('should return true if the result is a success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const isSuccess = Result.isSuccess(success);
      // Assert
      expect(isSuccess).toBe(true);
    });

    it('should return false if the result is a failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const isSuccess = Result.isSuccess(failure);
      // Assert
      expect(isSuccess).toBe(false);
    });

    it('should act as a type guard', () => {
      // Arrange
      const success: Result<number, never> = Result.success(123);
      // Act
      if (Result.isSuccess(success)) {
        // Assert
        expectTypeOf(success).toEqualTypeOf<Success<number>>();
      } else {
        // Assert
        expectTypeOf(success).toEqualTypeOf<Failure<never>>();
      }
    });
  });

  describe('when checking if a result is a failure', () => {
    it('should return true if the result is a failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const isFailure = Result.isFailure(failure);
      // Assert
      expect(isFailure).toBe(true);
    });

    it('should return false if the result is a success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const isFailure = Result.isFailure(success);
      // Assert
      expect(isFailure).toBe(false);
    });

    it('should act as a type guard', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      if (Result.isFailure(failure)) {
        // Assert
        expectTypeOf(failure).toEqualTypeOf<Failure<string>>();
      } else {
        // Assert
        expectTypeOf(failure).toEqualTypeOf<Success<never>>();
      }
    });
  });

  // #region unwrapping success result -----------------------------------------
  describe('unwrapping a success', () => {
    it('should return the value of a success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      if (Result.isSuccess(success)) {
        const value = Result.unwrap(success);
        // Assert
        expect(value).toBe(123);
      } else {
        throw new Error('Should be a success');
      }
    });

    it('should trigger a compilation error in case of failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act & Assert
      // @ts-expect-error Should trigger a compilation error
      Result.unwrap(failure);
    });
  });
  // #endregion unwrapping success result

  describe('unsafe unwrapping a result', () => {
    it('should unwrap a success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const value = Result.unsafeUnwrap(success);
      // Assert
      expect(value).toBe(123);
    });

    it('should throw an error in case of failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const act = () => Result.unsafeUnwrap(failure);
      // Assert
      expect(act).toThrow('Cannot unwrap a failure result');
    });
  });

  describe('unwrapping a failure', () => {
    it('should unwrap a failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      if (Result.isFailure(failure)) {
        const value = Result.unwrapFailure(failure);
        // Assert
        expect(value).toBe('error');
      } else {
        throw new Error('Should be a failure');
      }
    });

    it('should trigger a compilation error in case of success', () => {
      // Arrange
      const success = Result.success(123);
      // Act & Assert
      // @ts-expect-error Should trigger a compilation error
      Result.unwrapFailure(success);
    });
  });

  describe('unsafe unwrapping a failure', () => {
    it('should unwrap a failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const value = Result.unsafeUnwrapFailure(failure);
      // Assert
      expect(value).toBe('error');
    });

    it('should throw an error in case of success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const act = () => Result.unsafeUnwrapFailure(success);
      // Assert
      expect(act).toThrow('Cannot unwrap a success result');
    });
  });

  describe('when mapping a result to void', () => {
    it('should map a success to void', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const mapped = Result.mapToVoid(success);
      // Assert
      expectTypeOf(mapped).toEqualTypeOf<Result<void, never>>();
    });

    it('should unwrap the mapped value in case of success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const mapped = Result.mapToVoid(success);
      // Assert
      if (Result.isSuccess(mapped)) {
        expect(Result.unwrap(mapped)).toBeUndefined();
      } else {
        throw new Error('Should be a success');
      }
    });

    it('should return the failure in case of failure', () => {
      // Arrange
      const failure: Result<string, string> = Result.failure('error');
      // Act
      const mapped = Result.mapToVoid(failure);
      // Assert
      if (Result.isFailure(mapped)) {
        expect(Result.unwrapFailure(mapped)).toBe('error');
      } else {
        throw new Error('Should be a failure');
      }
    });
  });

  describe('when transforming a result to a failure', () => {
    it('should transform a success to a failure', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const transformed = Result.transformToFailure(success);
      // Assert
      expectTypeOf(transformed).toEqualTypeOf<Result<never, number>>();
    });

    it('should unwrap the success as failure', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const transformed = Result.transformToFailure(success);
      // Assert
      if (Result.isFailure(transformed)) {
        expect(Result.unwrapFailure(transformed)).toBe(123);
      } else {
        throw new Error('Should be a failure');
      }
    });

    it('should return the original failure in case of failure', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const transformed = Result.transformToFailure(failure);
      // Assert
      if (Result.isFailure(transformed)) {
        expect(Result.unwrapFailure(transformed)).toBe('error');
      } else {
        throw new Error('Should be a failure');
      }
    });
  });

  // #region working with results ----------------------------------------------
  describe('when working with results', () => {
    it('should combine results together', () => {
      // Arrange
      class DatabaseError extends Error {}
      interface User {
        id: string;
        name: string;
      }
      function findUser(
        userId: string
      ): Result<User | undefined, DatabaseError> {
        return Result.success({ id: userId, name: 'John' });
      }
      class InvalidUserIdError extends Error {}
      class UserNotFoundError extends Error {}

      // Act
      type GetUserOrFail = (
        userId: string
      ) => Result<User, InvalidUserIdError | UserNotFoundError | DatabaseError>;
      const getUserOfFail: GetUserOrFail = (userId: string) => {
        if (userId === '') {
          return Result.failure(new InvalidUserIdError());
        }
        const userResult = findUser(userId);
        if (Result.isFailure(userResult)) {
          return Result.transformToFailure(userResult);
        }
        const user = Result.unwrap(userResult);
        if (user === undefined) {
          return Result.failure(new UserNotFoundError());
        }
        return Result.success(user);
      };

      // Assert
      expectTypeOf(getUserOfFail).toEqualTypeOf<GetUserOrFail>();
    });
  });
  // #endregion working with results

  // #region match -------------------------------------------------------------
  describe('when matching a result', () => {
    it('should match a success to another value', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const matched = Result.match(success, {
        onSuccess: (value) => value.toString() + ' matched',
      });
      // Assert
      expect(Result.unsafeUnwrap(matched)).toBe('123 matched');
    });

    it('should match a failure to another value', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const matched = Result.match(failure, {
        onFailure: (value) => value + ' matched',
      });
      // Assert
      expect(Result.unsafeUnwrapFailure(matched)).toBe('error matched');
    });

    it('should not call the onSuccess match handler for a failure', () => {
      // Arrange
      const failure = Result.failure('error');
      const onSuccess = jest.fn();
      // Act
      const matched = Result.match(failure, {
        onSuccess,
      });
      // Assert
      expect(Result.isFailure(matched)).toBe(true);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should not call the onFailure match handler for a success', () => {
      // Arrange
      const success = Result.success(123);
      const onFailure = jest.fn();
      // Act
      const matched = Result.match(success, {
        onFailure,
      });
      // Assert
      expect(Result.isSuccess(matched)).toBe(true);
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('should alter the type of the result success based on the match handler', () => {
      // Arrange
      const resultBeforeMatch = Result.success(123);
      // Act

      const resultAfterMatch = Result.match(resultBeforeMatch, {
        onSuccess: (value) => value.toString(),
      });
      // Assert
      expectTypeOf(resultBeforeMatch).toEqualTypeOf<Result<number, never>>();
      expectTypeOf(resultAfterMatch).toEqualTypeOf<Result<string, never>>();
    });

    it('should alter the type of the result failure based on the match handler', () => {
      // Arrange
      const resultBeforeMatch = Result.failure(new Error('error'));
      // Act
      const resultAfterMatch = Result.match(resultBeforeMatch, {
        onFailure: (value) => value.message + ' matched',
      });
      // Assert
      expectTypeOf(resultBeforeMatch).toEqualTypeOf<Result<never, Error>>();
      expectTypeOf(resultAfterMatch).toEqualTypeOf<Result<never, string>>();
    });

    it('should not alter the success type if no onSuccess handler is provided', () => {
      // Arrange
      const resultBeforeMatch = Result.success(123);
      // Act
      const resultAfterMatch = Result.match(resultBeforeMatch, {
        onFailure: () => new Error(':('),
      });
      // Assert
      expectTypeOf(resultBeforeMatch).toEqualTypeOf<Result<number, never>>();
      expectTypeOf(resultAfterMatch).toEqualTypeOf<Result<number, Error>>();
    });

    it('should not alter the failure type if no onFailure handler is provided', () => {
      // Arrange
      const resultBeforeMatch = Result.failure(new Error('error'));
      // Act
      const resultAfterMatch = Result.match(resultBeforeMatch, {
        onSuccess: () => 123,
      });
      // Assert
      expectTypeOf(resultBeforeMatch).toEqualTypeOf<Result<never, Error>>();
      expectTypeOf(resultAfterMatch).toEqualTypeOf<Result<number, Error>>();
    });
  });
  // #endregion match

  // #region transformToSuccess ------------------------------------------------
  describe('when transforming a result to success', () => {
    it('should transform a failure to a success', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const transformed = Result.transformToSuccess(failure);
      // Assert
      expectTypeOf(transformed).toEqualTypeOf<Result<string, never>>();
    });

    it('should unwrap the failure as success', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const transformed = Result.transformToSuccess(failure);
      // Assert
      if (Result.isSuccess(transformed)) {
        expect(Result.unwrap(transformed)).toBe('error');
      } else {
        throw new Error('Should be a success');
      }
    });

    it('should return the original success in case of success', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const transformed = Result.transformToSuccess(success);
      // Assert
      if (Result.isSuccess(transformed)) {
        expect(Result.unwrap(transformed)).toBe(123);
      } else {
        throw new Error('Should be a success');
      }
    });
  });
  // #endregion transformToSuccess

  // #region is ----------------------------------------------------------------
  describe('when checking if a value is of any type of Result', () => {
    it('should return true for a success result', () => {
      // Arrange
      const success = Result.success(123);
      // Act
      const isResult = Result.is(success);
      // Assert
      expect(isResult).toBe(true);
    });

    it('should return true for a failure result', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act
      const isResult = Result.is(failure);
      // Assert
      expect(isResult).toBe(true);
    });

    it('should return false for a non-result value', () => {
      // Arrange
      const notAResult = { value: 123 };
      // Act
      const isResult = Result.is(notAResult);
      // Assert
      expect(isResult).toBe(false);
    });
  });
  // #endregion is

  // #region Assertions ---------------------------------------------------------
  describe('when asserting a success result', () => {
    it('should not throw an error for a success result', () => {
      // Arrange
      const success = Result.success(123);
      // Act & Assert
      expect(() => Result.assertSuccess(success)).not.toThrow();
    });

    it('should throw the failure as an error', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act & Assert
      expect(() => Result.assertSuccess(failure)).toThrow('error');
    });
  });

  describe('when asserting a failure result', () => {
    it('should not throw an error for a failure result', () => {
      // Arrange
      const failure = Result.failure('error');
      // Act & Assert
      expect(() => Result.assertFailure(failure)).not.toThrow();
    });

    it('should throw an error for a success result', () => {
      // Arrange
      const success = Result.success(123);
      // Act & Assert
      expect(() => Result.assertFailure(success)).toThrow(
        'Expected a failure result, but got a success result'
      );
    });

    it('should throw an instance of a TypeError', () => {
      // Arrange
      const success = Result.success(123);
      // Act & Assert
      expect(() => Result.assertFailure(success)).toThrow(TypeError);
    });

    it('should accept a custom message', () => {
      // Arrange
      const success = Result.success(123);
      // Act & Assert
      expect(() =>
        Result.assertFailure(success, 'Custom error message')
      ).toThrow('Custom error message');
    });
  });
  // #endregion Assertions
});
