import { useAppOwner, useQuery, useEvolu } from "@evolu/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from "@mui/material";
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

    const [unit, setUnit] = useState<string>('m');

    return (
        <div>
            <h1>Settings</h1>
            <SettingsSection title="Jednotky">
                <Box display="flex" flexDirection="column" gap={2}>
                    <FormControl fullWidth>
                        <InputLabel id="unit-label">Select Unit</InputLabel>
                        <Select
                            labelId="unit-label"
                            value={unit}
                            label="Select Unit"
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <MenuItem value="m">Meters (m)</MenuItem>
                            <MenuItem value="km">Kilometers (km)</MenuItem>
                            <MenuItem value="ha">Hectares (ha)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </SettingsSection>

            <SettingsSection title="Custom">
                <TextField
                    select
                    label="Theme"
                    fullWidth
                    defaultValue="light"
                >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                </TextField>
            </SettingsSection>

            <SettingsSection title="Private">
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
                <Button variant="contained" fullWidth onClick={() => setImportAppOwnerDialogOpen(true)}>Import mnemonic</Button>
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
                    question="Are you sure you wand delete owner data?"
                    open={isResetAppOwnerDialogOpen}
                    onClose={() => setResetAppOwnerDialogOpen(false)}
                    onConfirm={() => evolu.resetAppOwner()}
                />
            </SettingsSection>
        </div>
    );
};

const SettingsSection: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => (
    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" flexDirection="column" gap={2}>
            {children}
        </Box>
    </Paper>
  );