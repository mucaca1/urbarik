import React, { useState, useEffect } from 'react';
import {
    TextField,
    InputAdornment,
    inputBaseClasses,
    styled,
    TextFieldProps,
} from '@mui/material';
import { useUnit } from '../context/UnitContext';
import { toBaseUnit, fromBaseUnit } from '../utils/unitConversion';

// Styled TextField to hide number input arrows
const AreaUnitInputField = styled(TextField)({
    // Chrome, Safari, Edge
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
    // Firefox
    '& input[type=number]': {
        MozAppearance: 'textfield',
    },
});

interface AreaInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    baseValue: number; // in m²
    onBaseValueChange: (valueInM2: number) => void;
}

const AreaUnitInput: React.FC<AreaInputProps> = ({
    baseValue,
    onBaseValueChange,
    label,
    ...restProps
}) => {
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
        <AreaUnitInputField
            type="number"
            value={localValue}
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
            {...restProps}
        />
    );
};

export default AreaUnitInput;