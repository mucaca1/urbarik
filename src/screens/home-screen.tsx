import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from "@mui/material";
import { getAllSubjectsQuery, TAllSubjectsRow } from "../evolu-queries";
import { useEvolu, useQuery } from "@evolu/react";
import { QueryRows, Row } from "@evolu/common";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Padding } from "@mui/icons-material";
import { toast, ToastContainer, ToastOptions } from "react-toastify";

const subjectColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 250},
    { field: 'lastName', headerName: 'Last name', width: 250 },
    { field: 'identityCard', headerName: 'Identity card', width: 100 },
    { field: 'address', headerName: 'Address', width: 250 },
  ];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const toastSettings: ToastOptions = {
    position: "bottom-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
}

const notifySuccess = (msg: string) => toast.success(msg, toastSettings);

const notifyError = (msg: string) => toast.error(msg, toastSettings);

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();

    const subjects: QueryRows<TAllSubjectsRow> = useQuery(getAllSubjectsQuery);
    console.log(subjects);
    const rows = subjects.map((row) => (
        {
            id: row.id, 
            lastName: row.lastName, 
            firstName: row.firstName,
            identityCard: row.nationalIdNumber,
            address: row.address ? (`${row.address.street} ${row.address.postCode}, ${row.address.city}`) : ""
        }
    ));


    const { insert } = useEvolu();
    const [showAddSubject, setShowAddSubject] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const firstName = formJson.firstName;
        const lastName = formJson.lastName;
        const nationalIdentificationNumber = formJson.nationalIdentificationNumber;
        const subjectInsertResult = insert('subject', { firstName: firstName, lastName: lastName, nationalIdNumber: nationalIdentificationNumber})

        if (subjectInsertResult.ok) {
            notifySuccess("Successfully stored");
        } else {
            notifyError("Stored failed");
        }
        setShowAddSubject(false);
      };

    return (
        <div>
            <ToastContainer />
            <Dialog
                open={showAddSubject}
                aria-labelledby="scroll-dialog-title"
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={() => setShowAddSubject(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="scroll-dialog-title">{"Add subject"}</DialogTitle>
                
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'column' }}
                            gap={2}
                            paddingTop={"5%"}
                        >
                            <TextField id="firstName" name="firstName" label="First name"></TextField>
                            <TextField id="lastName" name="lastName" label="Last name"></TextField>
                            <TextField id="nationalIdentificationNumber" name="nationalIdentificationNumber" label="National identification number"></TextField>

                        </Box>

                        <DialogActions>
                            <Button onClick={() => setShowAddSubject(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <h1>{t('home')}</h1>
            <Button onClick={() => setShowAddSubject(true)}><PersonAddIcon/> Add subject</Button>
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