import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { getAllLandOwnershipQuery, getAllLandPartQuery, getAllSubjectsQuery, TAllLandOwnershipRow, TAllSubjectsRow } from "../evolu-queries";
import { useQuery } from "@evolu/react";
import { QueryRows, Row } from "@evolu/common";
import React, { useState } from "react";
import { TLandOwnershipId, TLandPartId, TSubjectId } from "../evolu-db";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddOptionsButton from "../components/EditorOptionsButtonBar";
import { useUnit } from "../context/UnitContext";
import { fromBaseUnit } from "../utils/unitConversion";
import { formatFraction } from "../utils/fraction";

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

const landOwnershipColumns: GridColDef[] = [
    { field: 'landPart', headerName: 'Land part', width: 250 },
    { field: 'subject', headerName: 'Subject', width: 250 },
    { field: 'fraction', headerName: 'Fraction', width: 250 }
];


export const HomeScreen: React.FC = () => {
    const { t } = useTranslation();
    const { unit, unitAsString } = useUnit();
    const [selectedSubject, setSelectedSubject] = useState<TSubjectId | null>(null);
    const [selectedLandPart, setSelectedLandPart] = useState<TLandPartId | null>(null);
    const [selectedLandOwnership, setSelectedLandOwnership] = useState<TLandOwnershipId | null>(null);
    const [table, setTable] = useState<"subject" | "landPart" | "landOwnership">("subject");

    const swapTable = (event: React.MouseEvent<HTMLElement>, table: "subject" | "landPart" | "landOwnership" | null) => {
        if (table !== null) {
            setTable(table);
            setSelectedSubject(null);
            setSelectedLandPart(null);
            setSelectedLandOwnership(null);
        }
    }

    let rows = {} as Row[];

    if (table === "subject") {
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
    } else if (table === "landPart") {
        const landParts: QueryRows = useQuery(getAllLandPartQuery);
        rows = landParts.map((row: any) => (
            {
                id: row.id,
                certificateOfOwnership: row.certificateOfOwnership,
                plotDimensions: fromBaseUnit(row.plotDimensions || 0, unit).toString() + " " + unitAsString(unit)
            }
        ));
    } else if (table === "landOwnership") {
        const landOwnerships: QueryRows<TAllLandOwnershipRow> = useQuery(getAllLandOwnershipQuery);
        rows = landOwnerships.map((row: TAllLandOwnershipRow) => (
            {
                id: row.id,
                landPart: row.landPart ? `${row.landPart.certificateOfOwnership || ""} (${fromBaseUnit(row.landPart.plotDimensions || 0, unit)} ${unitAsString(unit) })` : "",
                subject: row.subjectName ? `${row.subjectName.firstName || ""} ${row.subjectName.lastName || ""}` : "",
                fraction: `${formatFraction(row.share as number)} (${row.landPart?.plotDimensions ? fromBaseUnit(row.share as number * row.landPart.plotDimensions as number || 0, unit) + " " + unitAsString(unit) : ""})`
            }
        ));
    }

    return (
        <div>
            <h1>{t('home')}</h1>
            <AddOptionsButton dialogObject={
                {
                    value: table === "subject" ? selectedSubject : table === "landPart" ? selectedLandPart : selectedLandOwnership,
                    type: table
                }
            }/>
            <ToggleButtonGroup
                value={table}
                exclusive
                size="large"
                fullWidth
                onChange={swapTable}
            >
                <ToggleButton value="subject"><AccountCircleIcon /> Subjects</ToggleButton>
                <ToggleButton value="landPart"><MapIcon /> Land part</ToggleButton>
                <ToggleButton value="landOwnership"><AddLocationAltIcon />Land ownership</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={table === "subject" ? subjectColumns : table === "landPart" ? landPartColumns : landOwnershipColumns}
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
                                setSelectedLandOwnership(null);
                            } else {
                                if (table === "subject") {
                                    setSelectedSubject(a.value as TSubjectId);
                                } else if (table === "landPart") {
                                    setSelectedLandPart(a.value as TLandPartId);
                                } else if (table === "landOwnership") {
                                    setSelectedLandOwnership(a.value as TLandOwnershipId);
                                }
                            }
                        }
                    }
                />
            </Box>
        </div>
    );
}