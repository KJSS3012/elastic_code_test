import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          // Pelo menos um CPF ou CNPJ deve estar preenchido
          return !!(obj.cpf || obj.cnpj);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Either CPF or CNPJ must be provided';
        },
      },
    });
  };
}
