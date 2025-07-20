import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    TextField
} from '@mui/material';
import { evolu, TLandPartId } from '../evolu-db';
import { getAllLandPartQuery, TAllLandPartRow } from '../evolu-queries';
import { QueryRows } from '@evolu/common';
import { useUnit } from '../context/UnitContext';
import { fromBaseUnit } from 'src/utils/unitConversion';

interface LandPartProps {
    setSelectedLandPart?: (subject: TLandPartId | null) => void;
    disabled?: boolean;
    required?: boolean;
}

interface LandPartInterface {
    id: TLandPartId;
    certificateOfOwnership: string,
    plotDimensions: number
}

const LandPartPicker: React.FC<LandPartProps> = ({
    setSelectedLandPart = undefined,
    disabled = false,
    required = false
}) => {
    const { unit, unitAsString } = useUnit();
    const [value, setValue] = useState<LandPartInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [landParts, setLandParts] = useState<LandPartInterface[]>([]);

    useEffect(() => {
        const landPartsQuery: Promise<QueryRows<TAllLandPartRow>> = evolu.loadQuery(getAllLandPartQuery);
        landPartsQuery.then((landPart: QueryRows<TAllLandPartRow>) => {
            setLandParts(landPart.map((row: TAllLandPartRow) => (
                {
                    id: row.id,
                    certificateOfOwnership: row.certificateOfOwnership as string || '',
                    plotDimensions: row.plotDimensions as number || 0
                }
            )));
        }).finally(() => {
            setLoading(false);
        });
    });

    return (
        <Autocomplete
            loading={loading}
            loadingText="Loading land parts..."
            options={landParts}
            getOptionLabel={(option) => `${option.certificateOfOwnership} (${fromBaseUnit(option.plotDimensions, unit)} ${unitAsString(unit)})`}
            value={value}
            onChange={(event, newValue: LandPartInterface | null) => { setValue(newValue); setSelectedLandPart && setSelectedLandPart(newValue?.id || null); }}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    required={required}
                    label={"Land part"}
                    placeholder="Start typing to search..."
                />
            )}
        />
    );
};

export default LandPartPicker;
