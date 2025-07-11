// Simple test to validate Jest setup
export const sum = (a: number, b: number): number => a + b;

export const isEven = (num: number): boolean => num % 2 === 0;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
