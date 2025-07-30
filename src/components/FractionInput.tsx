import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { formatFraction, isValidFraction, parseFraction } from '../utils/fraction';
import { Result, ok, err } from '@evolu/common';

interface FractionInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  required?: boolean;
  maxValue?: number
}

const FractionInput: React.FC<FractionInputProps> = ({
  label = 'Value',
  value = null,
  onChange = (v: number | null) => {},
  required = false,
  maxValue = 1
}) => {
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    value !== null ? value.toString() : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let t: any = null;
    if (value === null || value === undefined) {
      setInputValue('');
    } else {
      const formatted = isFractionMode ? formatFraction(value) : value.toString();
      setInputValue(formatted);
    }
    const validateResult: Result<number | null, string> = validateInput(value === null || value === undefined ? '' : (isFractionMode ? formatFraction(value) : value.toString()), required, isFractionMode, maxValue);
    if (!validateResult.ok) {
      setError(validateResult.error);
    }
  }, [value, maxValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(val);

    const validateResult: Result<number | null, string> = validateInput(val, required, isFractionMode, maxValue);
    if (validateResult.ok) {
      setError(null);
      if (onChange) onChange(validateResult.value);
    } else {
      setError(validateResult.error);
    }
  };

  const handleToggle = () => {
    const parsed = parseFraction(inputValue);
    const newValue =
      isFractionMode || isNaN(parsed)
        ? parsed.toString()
        : formatFraction(parsed);

    setInputValue(inputValue === '' ? '' : newValue);
    setError(null);
    setIsFractionMode(!isFractionMode);
  };

  return (
    <TextField
      label={label}
      type={isFractionMode ? 'text' : 'number'}
      value={inputValue}
      onChange={handleInputChange}
      error={!!error}
      helperText={error}
      fullWidth
      slotProps={{
        input: {
          required,
          'aria-required': required ? 'true' : 'false',
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={isFractionMode ? 'Switch to decimal' : 'Switch to fraction'}>
                <IconButton onClick={handleToggle} size="small">
                  <SwapHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

interface ValidationError {
  readonly message: string;
}

const validateInput = (value: string, required: boolean, isFractionMode: boolean, maxValue: number): Result<number | null, string> => {
  if (value === '') {
    if (required) {
      return err('Value is required')
    } else {
      return ok(null);
    }
  }

  if (isFractionMode) {
    if (!isValidFraction(value)) {
      return err('Invalid fraction format (e.g. 3/4)');
    }
    const parsed = parseFraction(value);
    if (parsed > maxValue) {
      return err( `Number value must be between 0 and ${maxValue}`);
    }
    if (!isNaN(parsed)) return ok(parsed);
  } else {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return err('Invalid number')
    }
    if (parsed > maxValue) {
      return err(`Number value must be between 0 and ${maxValue}`)
    }
    return ok(parsed);
  }
  return err('Undefined parse error');
}

export default FractionInput;
export type { FractionInputProps };
