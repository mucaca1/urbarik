import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface FractionInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  required?: boolean;
}

const FractionInput: React.FC<FractionInputProps> = ({
  label = 'Value',
  value = null,
  onChange,
  required = false,
}) => {
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    value !== null ? value.toString() : ''
  );
  const [error, setError] = useState<string | null>(null);

  const parseFraction = (input: string): number => {
    const parts = input.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
    return parseFloat(input); // fallback
  };

  const isValidFraction = (input: string): boolean => {
    const parts = input.split('/');
    if (parts.length !== 2) return false;
    const [numerator, denominator] = parts.map((p) => parseFloat(p));
    return (
      !isNaN(numerator) &&
      !isNaN(denominator) &&
      denominator !== 0 &&
      /^\s*\d+\s*\/\s*\d+\s*$/.test(input)
    );
  };

  const formatFraction = (val: number): string => {
    const tolerance = 1.0e-6;
    let numerator = 1;
    let denominator = 1;
    let error = Math.abs(val - numerator / denominator);

    for (let d = 1; d <= 1000; d++) {
      const n = Math.round(val * d);
      const approx = n / d;
      const err = Math.abs(val - approx);
      if (err < error - tolerance) {
        numerator = n;
        denominator = d;
        error = err;
      }
    }

    return `${numerator}/${denominator}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(val);

    if (val === '') {
      setError(required ? 'Value is required' : null);
      if (onChange) onChange(null);
      return;
    }

    if (isFractionMode) {
      if (!isValidFraction(val)) {
        setError('Invalid fraction format (e.g. 3/4)');
        return;
      }
      const parsed = parseFraction(val);
      setError(null);
      if (!isNaN(parsed) && onChange) onChange(parsed);
    } else {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        setError('Invalid number');
        return;
      }
      setError(null);
      if (onChange) onChange(parsed);
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

export default FractionInput;
export type { FractionInputProps };
