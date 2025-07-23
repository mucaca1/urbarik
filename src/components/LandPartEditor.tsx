import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField, Typography } from "@mui/material";
import { Transition } from "../utils/transition";
import { useEvolu, useQuery } from "@evolu/react";
import { notifyError, notifySuccess } from "../utils/toastNotification";
import { TLandPartId } from "../evolu-db";
import { ToastContainer } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getLandPart } from "../evolu-queries";
import { EditorType } from "../types";
import AreaUnitInput from "./AreaUnitInput";
import { useUnit } from "../context/UnitContext";
import { JSX, useEffect, useState } from "react";

interface LandPartEditorProps {
    landPartId: TLandPartId | null,
    editorType: EditorType | null,
    onClose: () => void,
    isEditorShowed: boolean,
    formButtons?: JSX.Element;
}

interface FormValues {
    certificateOfOwnership: string;
    plotDimensions: number;
}

const LandPartEditor: React.FC<LandPartEditorProps> = ({ landPartId, editorType, onClose, isEditorShowed, formButtons = (<></>) }) => {
    const { insert, update } = useEvolu();
    const [loadingData, setLoadingData] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            certificateOfOwnership: '',
            plotDimensions: 0
        }
    });

    useEffect(() => {
        if (isEditorShowed) {
            // Reset form values based on type
            if (editorType === "create") {
                setValue('certificateOfOwnership', '');
                setValue('plotDimensions', 0);
            }

            // Fetch subject data if editing
            if (editorType === "edit" && landPartId) {
                setLoadingData(true);
                getLandPart(landPartId).then((result) => {
                    const landPart = result[0];
                    if (landPart) {
                        setValue('certificateOfOwnership', landPart.certificateOfOwnership as string);
                        setValue('plotDimensions', landPart.plotDimensions as number);
                    } else {
                        notifyError("Land part not found");
                    }
                    console.log("Fetched land part:", result);
                    setLoadingData(false);
                }).catch((error) => {
                    console.error("Error fetching land part:", error);
                    notifyError("Failed to fetch land data");
                    setLoadingData(false);
                });
            }
        }
    }, [isEditorShowed])

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        let certificateOfOwnership: string = data.certificateOfOwnership;
        let plotDimensions: number = data.plotDimensions;

        if (editorType === "edit" && landPartId) {
            const landPartUpdateResult = update('landPart', {
                id: landPartId,
                certificateOfOwnership: certificateOfOwnership,
                plotDimensions: plotDimensions
            });
            if (landPartUpdateResult.ok) {
                console.log("Ladn part updated successfully:", landPartUpdateResult);
                notifySuccess("Successfully updated");
                reset();
                onClose();
            } else {
                console.error("Error updating land part:", landPartUpdateResult.error);
                notifyError("Update failed");
            }

        } else if (editorType === "create") {
            const landPartInsertResult = insert('landPart', {
                certificateOfOwnership: certificateOfOwnership,
                plotDimensions: plotDimensions
            });

            if (landPartInsertResult.ok) {
                console.log("Land part stored successfully:", landPartInsertResult);
                notifySuccess("Successfully stored");
                reset();
                onClose();
            } else {
                console.error("Error storing land part:", landPartInsertResult.error);
                notifyError("Stored failed");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'column' }}
                gap={2}
                paddingTop="5%"
            >
                {loadingData  && <LinearProgress />}
            <Controller
                name="certificateOfOwnership"
                control={control}
                render={({ field }) => (
                    <TextField {...field} label="Certificate of ownership" fullWidth required />
                )}
            />
            <Controller
                name="plotDimensions"
                control={control}
                render={({ field }) => (
                    <AreaUnitInput {...field}
                    label="Plot dimensions"
                    fullWidth
                    required
                    baseValue={field.value}
                    onBaseValueChange={(valueInM2: number) => setValue("plotDimensions", valueInM2)} />
                )}
            />
        </Box>

        {formButtons}
    </form>
    );
}

export default LandPartEditor;