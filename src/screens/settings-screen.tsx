import { useAppOwner, useQuery, useEvolu } from "@evolu/react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { FC, useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { QuestionDialog } from "../components/dialog";
import { getAllSubjectsQuery } from "../evolu-queries";

export const SettingsScreen: FC = () => {
    const owner = useAppOwner();
    const evolu = useEvolu();
    const [isResetAppOwnerDialogOpen, setResetAppOwnerDialogOpen] = useState(false);
    const [isImportAppOwnerDialogOpen, setImportAppOwnerDialogOpen] = useState(false);


    const rows = useQuery(getAllSubjectsQuery);
    const demoData = rows.map((row) => (
        <div>{row.name}</div>
    ))

    return (
        <div>
            <h1>Settings</h1>
            {demoData}
            <FormControl variant="outlined" fullWidth disabled>
                <InputLabel htmlFor="mnemonic-content">Mnemonic</InputLabel>
                <OutlinedInput
                    value={owner?.mnemonic || ""}
                    id="mnemonic-content"
                    type={"text"}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => navigator.clipboard.writeText(owner?.mnemonic.toString() || "")}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Mnemonic"
                />
            </FormControl>

            <br />
            <br />
            <div>
                <Button variant="contained" fullWidth onClick={() => setImportAppOwnerDialogOpen(true)}>Import mnemonic</Button>
            </div>
            <br />
            <br />
            <Button
                startIcon={<DeleteIcon />} 
                variant="contained" 
                color="error" 
                fullWidth 
                onClick={() => setResetAppOwnerDialogOpen(true)}>
                    Delete all data
            </Button>

            <Dialog
                fullWidth
                open={isImportAppOwnerDialogOpen}
                onClose={() => setImportAppOwnerDialogOpen(false)}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const mnemonic = formJson.mnemonic;
                            evolu.restoreAppOwner(mnemonic);
                            setImportAppOwnerDialogOpen(false);
                        },
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Write your mnemonic key
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="mnomonic-text-field"
                        name="mnemonic"
                        label="Mnemonic"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportAppOwnerDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Import</Button>
                </DialogActions>
            </Dialog>

            <QuestionDialog 
                question = "Are you sure you wand delete owner data?"
                open = {isResetAppOwnerDialogOpen}
                onClose={() => setResetAppOwnerDialogOpen(false)}
                onConfirm={() => evolu.resetAppOwner()}
            />
        </div>
    );
};