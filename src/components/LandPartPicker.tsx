import React, { useState } from 'react';
import {
    Autocomplete,
    TextField
} from '@mui/material';
import { TLandPartId } from '../evolu-db';
import { getAllLandPartQuery, TAllLandPartRow } from '../evolu-queries';
import { useUnit } from '../context/UnitContext';
import { fromBaseUnit } from '../utils/unitConversion';
import { useQuery } from '@evolu/react';

interface LandPartProps {
    disabled?: boolean;
    required?: boolean;
    value: TLandPartId | null;
    onChange: (value: TLandPartId | null) => void;
}

interface LandPartInterface {
    id: TLandPartId;
    certificateOfOwnership: string;
    plotDimensions: number;
}

const LandPartPicker: React.FC<LandPartProps> = ({
    disabled = false,
    required = false,
    value,
    onChange,
}) => {
    const { unit, unitAsString } = useUnit();
    const [loading, setLoading] = useState<boolean>(true);
    const [landParts, setLandParts] = useState<LandPartInterface[]>(useQuery(getAllLandPartQuery).map((row: TAllLandPartRow) => (
        {
            id: row.id,
            certificateOfOwnership: row.certificateOfOwnership || '',
            plotDimensions: row.plotDimensions || 0
        })));

    /*
    useEffect(() => {
        const landPartsQuery: Promise<QueryRows<TAllLandPartRow>> = evolu.loadQuery(getAllLandPartQuery);
        landPartsQuery.then((landPart: QueryRows<TAllLandPartRow>) => {
            setLandParts(landPart.map((row: TAllLandPartRow) => (
                {
                    id: row.id,
                    certificateOfOwnership: row.certificateOfOwnership || '',
                    plotDimensions: row.plotDimensions || 0
                }
            )));
        }).finally(() => {
            setLoading(false);
        });
    });*/

    return (
        <Autocomplete
            //loading={loading}
            loadingText="Loading land parts..."
            options={landParts}
            getOptionLabel={(option) => `${option.certificateOfOwnership} (${fromBaseUnit(option.plotDimensions, unit)} ${unitAsString(unit)})`}
            value={value ? landParts.find((lp) => lp.id === value) || null : null}
            onChange={(_, newValue: LandPartInterface | null) => onChange(newValue?.id || null)}
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
