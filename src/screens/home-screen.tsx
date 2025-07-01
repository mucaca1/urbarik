import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { getAllSubjectsQuery, TAllSubjectsRow } from "../evolu-queries";
import { useEvolu, useQuery } from "@evolu/react";
import { QueryRows, Row } from "@evolu/common";

const subjectColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 500},
    { field: 'lastName', headerName: 'Last name', width: 500 },
    { field: 'address', headerName: 'Address', width: 500 },
  ];

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();

    const subjects: QueryRows<TAllSubjectsRow> = useQuery(getAllSubjectsQuery);
    console.log(subjects);
    const rows = subjects.map((row) => (
        {
            id: row.id, 
            lastName: row.surname, 
            firstName: row.name,
            address: row.address ? (`${row.address.street} ${row.address.postCode}, ${row.address.city}`) : ""
        }
    ));

    return (
        <div>
            <h1>{t('home')}</h1>
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
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    );
}