import { useAppOwner } from "@evolu/react";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { FC } from "react";
import { evolu } from "../evolu-db";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const SettingsScreen: FC = () => {
    const owner = useAppOwner();

    return (
        <div>
            <h1>Settings</h1>
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
            <Button variant="contained" fullWidth onClick={ () => evolu.resetAppOwner() }>Delete all data</Button>
        </div>
    );
};