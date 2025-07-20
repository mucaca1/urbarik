import React, { use, useEffect, useState } from 'react';
import {
    Autocomplete,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { evolu, TSubjectId } from '../evolu-db';
import { getAllSubjectsQuery, TAllSubjectsRow } from '../evolu-queries';
import { QueryRows } from '@evolu/common';
import { useQuery } from '@evolu/react';
import { ControllerRenderProps } from 'react-hook-form';

interface SubjectPickerProps {
    disabled?: boolean;
    value: TSubjectId | null;
    onChange: (value: TSubjectId | null) => void;
}

interface SubjectInterface {
    id: TSubjectId;
    lastName: string;
    firstName: string;
    identityCard: string;
}

const SubjectPicker: React.FC<SubjectPickerProps> = ({
    disabled = false,
    value,
    onChange,
}) => {
    //const [loading, setLoading] = useState<boolean>(true);
    const [subjects, setSubjects] = useState<SubjectInterface[]>(useQuery(getAllSubjectsQuery).map((row: TAllSubjectsRow) => (
        {
            id: row.id,
            lastName: row.lastName || '',
            firstName: row.firstName || '',
            identityCard: row.nationalIdNumber || ''
        }
        )));

    /*
    Do not work for now.
    Fetch subjects from the database and set them in the state.
    useEffect(() => {
        const subjectsP: Promise<QueryRows<TAllSubjectsRow>> = evolu.loadQuery(getAllSubjectsQuery);
        subjectsP.then((subjectsData: QueryRows<TAllSubjectsRow>) => {
            const data = subjectsData.map((row: TAllSubjectsRow) => (
                {
                    id: row.id,
                    lastName: row.lastName || '',
                    firstName: row.firstName || '',
                    identityCard: row.nationalIdNumber || ''
                }
            ))
            setSubjects(data);
        }).finally(() => {
            setLoading(false);
        });
    });*/

    return (
        <Autocomplete
            //loading={loading}
            loadingText="Loading subjects..."
            options={subjects}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={value ? subjects.find((s) => s.id === value) || null : null}
            onChange={(_, newValue: SubjectInterface | null) => onChange(newValue?.id || null) }
            isOptionEqualToValue={(option, val) => option.id === val.id}
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={"Subject"}
                    placeholder="Start typing to search..."
                />
            )}
            renderOption={(props, option) => (
                <Tooltip title={option.identityCard as string || ''} arrow>
                    <li {...props}>
                        <Typography>{option.firstName} {option.lastName}</Typography>
                    </li>
                </Tooltip>
            )}
        />
    );
};

export default SubjectPicker;
