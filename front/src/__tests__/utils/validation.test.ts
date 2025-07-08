import { validateCPF, validateCNPJ, formatCPF, formatCNPJ } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('CPF Validation', () => {
    test('should validate correct CPF', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
      expect(validateCPF('12345678909')).toBe(true);
    });

    test('should reject invalid CPF', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('123')).toBe(false);
    });

    test('should format CPF correctly', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
      expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
    });
  });

  describe('CNPJ Validation', () => {
    test('should validate correct CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    test('should reject invalid CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('123')).toBe(false);
    });

    test('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });
  });
});
