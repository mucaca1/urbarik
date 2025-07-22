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

  useEffect(() => {
    if (value === null || value === undefined) {
      setInputValue('');
    } else {
      const formatted = isFractionMode ? formatFraction(value) : value.toString();
      setInputValue(formatted);
    }
  }, [value]);

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
      if (parsed > 1) {
        setError('Number value must be between 0 and 1');
        return;
      }
      setError(null);
      if (!isNaN(parsed) && onChange) onChange(parsed);
    } else {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        setError('Invalid number');
        return;
      }
      if (parsed > 1) {
        setError('Number value must be between 0 and 1');
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
