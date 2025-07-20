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

interface SubjectPickerProps {
    setSelectedSubject?: (subject: TSubjectId | null) => void;
    disabled?: boolean;
    required?: boolean;
}

interface SubjectInterface {
    id: TSubjectId;
    lastName: string;
    firstName: string;
    identityCard: string
}

const SubjectPicker: React.FC<SubjectPickerProps> = ({
    setSelectedSubject = undefined,
    disabled = false,
    required = false
}) => {
    const [value, setValue] = useState<SubjectInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [subjects, setSubjects] = useState<SubjectInterface[]>([]);

    useEffect(() => {
        const subjects: Promise<QueryRows<TAllSubjectsRow>> = evolu.loadQuery(getAllSubjectsQuery);
        subjects.then((subjects: QueryRows<TAllSubjectsRow>) => {
            setSubjects(subjects.map((row: TAllSubjectsRow) => (
                {
                    id: row.id,
                    lastName: row.lastName || '',
                    firstName: row.firstName || '',
                    identityCard: row.nationalIdNumber || ''
                }
            )));
        }).finally(() => {
            setLoading(false);
        });
    });

    return (
        <Autocomplete
            loading={loading}
            loadingText="Loading subjects..."
            options={subjects}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={value}
            onChange={(event, newValue: SubjectInterface | null) => { setValue(newValue); setSelectedSubject && setSelectedSubject(newValue?.id || null); }}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    required={required}
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
