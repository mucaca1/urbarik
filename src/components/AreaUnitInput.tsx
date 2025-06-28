import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, OutlinedInput, InputLabel, inputBaseClasses, styled } from '@mui/material';
import { useUnit } from '../context/UnitContext';
import { toBaseUnit, fromBaseUnit } from '../utils/unitConversion';

// Styled TextField to hide number input arrows
const AreaUnitInputField = styled(TextField)({
    // For Chrome, Safari, Edge, Opera
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
    // For Firefox
    '& input[type=number]': {
        MozAppearance: 'textfield',
    },
});

interface AreaInputProps {
    label: string;
    baseValue: number; // in m²
    onBaseValueChange: (valueInM2: number) => void;
}

const AreaUnitInput: React.FC<AreaInputProps> = ({ label, baseValue, onBaseValueChange }) => {
    const { unit } = useUnit();
    const [localValue, setLocalValue] = useState(fromBaseUnit(baseValue, unit));

    useEffect(() => {
        setLocalValue(fromBaseUnit(baseValue, unit));
    }, [baseValue, unit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setLocalValue(value);
        if (!isNaN(value)) {
            const valueInM2 = toBaseUnit(value, unit);
            onBaseValueChange(valueInM2);
        }
    };

    return (
        <div>
            <AreaUnitInputField
                label={label}
                variant="outlined"
                type="number"
                fullWidth
                value={localValue | 0}
                onChange={handleChange}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                sx={{
                                    pointerEvents: 'none',
                                    [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {unit}
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </div>
    );
};

export default AreaUnitInput;
