import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Transition } from "../utils/transition";
import { useEvolu } from "@evolu/react";
import { notifyError, notifySuccess } from "../utils/toastNotification";
import { TSubjectId } from "../evolu-db";
import { ToastContainer } from "react-toastify";

interface SubjectEditorProps {
    subjectId: TSubjectId | null,
    showAddSubject: boolean,
    setShowAddSubject: (v: boolean) => void,
}

const SubjectEditor: React.FC<SubjectEditorProps> = ({ subjectId, showAddSubject, setShowAddSubject }) => {

    const { insert } = useEvolu();

    if (subjectId) {
        //getSubjectQuery(subjectId)
    }
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const firstName = formJson.firstName;
        const lastName = formJson.lastName;
        const nationalIdentificationNumber = formJson.nationalIdentificationNumber;

        const street = formJson.street;
        const houseNumber = formJson.houseNumber;
        const postcode = formJson.postcode;
        const city = formJson.city;

        const subjectInsertResult = insert('subject', {
            firstName: firstName, lastName: lastName, nationalIdNumber: nationalIdentificationNumber,
            street: street, houseNumber: houseNumber, postCode: Number.parseInt(postcode), city: city
        })

        if (subjectInsertResult.ok) {
            notifySuccess("Successfully stored");
        } else {
            notifyError("Stored failed");
        }
        setShowAddSubject(false);
    };

    return (<div>
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

                        <Typography variant="h6">
                            Address
                        </Typography>
                        <TextField id="street" name="street" label="Street"></TextField>
                        <TextField id="houseNumber" name="houseNumber" label="House number"></TextField>
                        <TextField id="postcode" name="postcode" label="Postcode" type="number"></TextField>
                        <TextField id="city" name="city" label="City"></TextField>

                    </Box>

                    <DialogActions>
                        <Button onClick={() => setShowAddSubject(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    </div>);
}

export default SubjectEditor;