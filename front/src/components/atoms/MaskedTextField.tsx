import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { IMaskInput } from 'react-imask';

interface MaskedTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  mask: string;
  value: string;
  onChange: (value: string) => void;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const MaskedTextField: React.FC<MaskedTextFieldProps> = ({
  mask,
  value,
  onChange,
  name = 'masked-field',
  ...textFieldProps
}) => {
  return (
    <TextField
      {...textFieldProps}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        inputComponent: TextMaskCustom as any,
        inputProps: {
          mask,
        },
      }}
    />
  );
};

export default MaskedTextField;
