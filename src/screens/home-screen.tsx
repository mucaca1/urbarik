import { useTranslation } from "react-i18next";
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, Paper, Slide, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { getAllLandPartQuery, getAllSubjectsQuery, getSubject, TAllSubjectsRow } from "../evolu-queries";
import { useEvolu, useQuery } from "@evolu/react";
import { QueryRows, Row } from "@evolu/common";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useState } from "react";
import { TLandPartId, TSubjectId } from "../evolu-db";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddOptionsButton from "../components/EditorOptionsButtonBar";

const subjectColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 250},
    { field: 'lastName', headerName: 'Last name', width: 250 },
    { field: 'identityCard', headerName: 'Identity card', width: 100 },
    { field: 'address', headerName: 'Address', width: 250 },
];

const landPartColumns: GridColDef[] = [
    { field: 'certificateOfOwnership', headerName: 'Certificate of ownership', width: 500 },
    { field: 'plotDimensions', headerName: 'Plot dimension', width: 250 }
];

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();
    const [selectedSubject, setSelectedSubject] = useState<TSubjectId | null>(null);
    const [selectedLandPart, setSelectedLandPart] = useState<TLandPartId | null>(null);
    const [table, setTable] = useState<number>(0);

    const swapTable = (newTable: number) => {
        if (newTable !== null) {
            setTable(newTable);
            setSelectedSubject(null);
            setSelectedLandPart(null);
        }
    }

    let rows = {} as Row[];

    if (table === 0) {
        const subjects: QueryRows<TAllSubjectsRow> = useQuery(getAllSubjectsQuery);
        rows = subjects.map((row: TAllSubjectsRow) => (
            {
                id: row.id,
                lastName: row.lastName,
                firstName: row.firstName,
                identityCard: row.nationalIdNumber,
                address: (`${row.street || ""} ${row.houseNumber || ""} ${row.postCode || ""} ${row.city || ""}`)
            }
        ));
    } else if (table === 1) {
        const landParts: QueryRows = useQuery(getAllLandPartQuery);
        rows = landParts.map((row: any) => (
            {
                id: row.id,
                certificateOfOwnership: row.certificateOfOwnership,
                plotDimensions: row.plotDimensions
            }
        ));
    }

    return (
        <div>
            <h1>{t('home')}</h1>
            <AddOptionsButton subjectId={selectedSubject} landPartId={selectedLandPart} ownershipId={null}/>
            <ToggleButtonGroup
                    exclusive
                    size="large"
                    fullWidth
                >
                <ToggleButton value="subject" onClick={() => swapTable(0)}><AccountCircleIcon /> Subjects</ToggleButton>
                <ToggleButton value="landPart" onClick={() => swapTable(1)}><MapIcon /> Land part</ToggleButton>
                <ToggleButton value="landOwnership"><AddLocationAltIcon />Land ownership</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={table === 0 ? subjectColumns : landPartColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 8,
                            },
                        },
                    }}
                    pageSizeOptions={[20]}
                    disableRowSelectionOnClick={false}
                    onRowSelectionModelChange={
                        (rowSelectionModel: GridRowSelectionModel) => {
                            const a = rowSelectionModel.ids.keys().next();
                            if (a.value === undefined) {
                                setSelectedSubject(null);
                                setSelectedLandPart(null);
                            } else {
                                if (table === 0) {
                                    setSelectedSubject(a.value as TSubjectId);
                                } else if (table === 1) {
                                    setSelectedLandPart(a.value as TLandPartId);
                                }
                            }
                        }
                    }
                />
            </Box>
        </div>
    );
}