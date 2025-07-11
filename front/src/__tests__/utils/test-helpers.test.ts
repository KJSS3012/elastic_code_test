import { sum, isEven, capitalize } from '../../utils/test-helpers';

describe('Test Helpers', () => {
  describe('sum function', () => {
    test('should add two positive numbers', () => {
      expect(sum(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
    });

    test('should handle zero', () => {
      expect(sum(0, 5)).toBe(5);
    });
  });

  describe('isEven function', () => {
    test('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    test('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
    });
  });

  describe('capitalize function', () => {
    test('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    test('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    test('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });
});
