import { useAppOwner, useQuery, useEvolu } from "@evolu/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { QuestionDialog } from "../components/dialog";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/ThemeContext";
import { ThemeMode } from "../themes";
import { Label } from "@mui/icons-material";
import { useUnit } from "../context/UnitContext";
import { AreaUnit } from "src/utils/unitConversion";

export const SettingsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const owner = useAppOwner();
    const evolu = useEvolu();
    const [isResetAppOwnerDialogOpen, setResetAppOwnerDialogOpen] = useState(false);
    const [isImportAppOwnerDialogOpen, setImportAppOwnerDialogOpen] = useState(false);

    let language = i18n.language || 'sk';

    const { mode, setTheme } = useContext(ThemeContext);
    const [theme, setThemeChoice] = useState<ThemeMode>(mode)

    const [showMnemonic, setShowMnemonic] = useState<boolean>(false);

    const { unit, setAreaUnit } = useUnit();
    
    const [areaUnitHolder, setAreaUnitHolder] = useState<AreaUnit>(unit);

        const handleAreaUnitChange = (event: React.MouseEvent<HTMLElement>, newUnit: string | null) => {
            if (newUnit) setAreaUnitHolder(newUnit as any);
        };

    return (
        <div>
            <h1>{t('settings')}</h1>
            <SettingsSection title={t('systemSectionLabel')}>
                <TextField
                    select
                    label={t('language')}
                    fullWidth
                    defaultValue={language}
                    onChange={(e) => language = e.target.value}
                >
                    <MenuItem value="en">En</MenuItem>
                    <MenuItem value="sk">Sk</MenuItem>
                </TextField>
                <TextField
                    select
                    label={t('theme')}
                    fullWidth
                    defaultValue={mode}
                    onChange={(e) => setThemeChoice(e.target.value === 'light' ? 'light' : 'dark')}
                >
                    <MenuItem value="light">{t('themeLight')}</MenuItem>
                    <MenuItem value="dark">{t('themeDark')}</MenuItem>
                </TextField>

                <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                    <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>{t('unitSelectionLabel')}</Typography>
                    <ToggleButtonGroup value={areaUnitHolder} exclusive onChange={handleAreaUnitChange} size="large" fullWidth>
                        <ToggleButton value="m2">m²</ToggleButton>
                        <ToggleButton value="km2">km²</ToggleButton>
                        <ToggleButton value="ha">ha</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Button fullWidth>{t('cancelBtn')}</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button fullWidth onClick={() => {
                            i18n.changeLanguage(language);
                            setTheme(theme);
                            if (areaUnitHolder) setAreaUnit(areaUnitHolder as any);
                        }}>{t('saveBtn')}</Button>
                    </Grid>
                </Grid>
            </SettingsSection>

            <SettingsSection title={t('private')}>
                <FormControl variant="outlined" fullWidth disabled>
                    <InputLabel htmlFor="mnemonic-content">Mnemonic</InputLabel>
                    <OutlinedInput
                        value={showMnemonic ? owner?.mnemonic || "" : "• • • •  • • • •  • • • •  • • • •"}
                        id="mnemonic-content"
                        type={"text"}
                        endAdornment={
                            <div>
                                <InputAdornment position="end">
                                    <IconButton
                                            onClick={() => navigator.clipboard.writeText(owner?.mnemonic.toString() || "")}
                                        >
                                            <ContentCopyIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setShowMnemonic(!showMnemonic)}
                                    >
                                        {!showMnemonic && <VisibilityIcon />}
                                        {showMnemonic && <VisibilityOffIcon />}
                                    </IconButton>
                                
                                </InputAdornment>
                            </div>
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
                    {t('deleteAllData')}
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
                    <DialogTitle>{t('import')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('importMnemonicDialog')}
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
                        <Button onClick={() => setImportAppOwnerDialogOpen(false)}>{t('cancelBtn')}</Button>
                        <Button type="submit">{t('import')}</Button>
                    </DialogActions>
                </Dialog>

                <QuestionDialog
                    question={t('deleteMnemonicQuestion')}
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