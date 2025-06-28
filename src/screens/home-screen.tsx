import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AreaUnitInput from "../components/AreaUnitInput";
import UnitSwitcher from "../components/UnitSwitcher";
import { UnitProvider } from "../context/UnitContext";

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();

    const [areaInM2, setAreaInM2] = useState(10000); // stored in base unit

    
    return (
        <div>
            <h1>{t('home')}</h1>
            <UnitProvider>
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>Area Input Demo</Typography>
                    <Box sx={{ mb: 2 }}>
                        <UnitSwitcher />
                    </Box>
                    <AreaUnitInput label='Test' baseValue={areaInM2} onBaseValueChange={setAreaInM2} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Stored in DB as: {areaInM2} m²
                    </Typography>
                </Container>
            </UnitProvider>
        </div>
    );
}