import { useTranslation } from "react-i18next";
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, Paper, Slide, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { getAllSubjectsQuery, getSubject, TAllSubjectsRow } from "../evolu-queries";
import { useEvolu, useQuery } from "@evolu/react";
import { QueryRows, Row } from "@evolu/common";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Padding } from "@mui/icons-material";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import { TSubjectId } from "../evolu-db";
import { EditorType } from "src/types";
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

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();
    const [selectedSubject, setSelectedSubject] = useState<TSubjectId | null>(null);

    const subjects: QueryRows<TAllSubjectsRow> = useQuery(getAllSubjectsQuery);
    const rows = subjects.map((row: TAllSubjectsRow) => (
        {
            id: row.id,
            lastName: row.lastName, 
            firstName: row.firstName,
            identityCard: row.nationalIdNumber,
            address: (`${row.street || ""} ${row.houseNumber || ""} ${row.postCode || ""} ${row.city || ""}`)
        }
    ));

    return (
        <div>
            <h1>{t('home')}</h1>
            <AddOptionsButton subjectId={selectedSubject} landPartId={null} ownershipId={null}/>
            <ToggleButtonGroup
                    exclusive
                    size="large"
                    fullWidth
                >
                <ToggleButton value="subject"><AccountCircleIcon /> Subjects</ToggleButton>
                <ToggleButton value="landPart"><MapIcon /> Land part</ToggleButton>
                <ToggleButton value="landOwnership"><AddLocationAltIcon />Land ownership</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={subjectColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
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
                            } else {
                                setSelectedSubject(a.value as TSubjectId);
                            }
                        }
                    }
                />
            </Box>
        </div>
    );
}