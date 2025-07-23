import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField } from "@mui/material";
import { Transition } from "../utils/transition";
import { useEvolu } from "@evolu/react";
import { notifyError, notifySuccess } from "../utils/toastNotification";
import { TLandOwnershipId, TLandPartId, TSubjectId } from "../evolu-db";
import { ToastContainer } from "react-toastify";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { getLandOwnership } from "../evolu-queries";
import { EditorType } from "../types";
import FractionInput from "./FractionInput";
import SubjectPicker from "./SubjectPicker";
import LandPartPicker from "./LandPartPicker";
import { JSX, use, useEffect, useState } from "react";

interface LandOwnershipEditorProps {
    landOwnershipId: TLandOwnershipId | null,
    editorType: EditorType | null,
    onClose: () => void,
    isEditorShowed: boolean,
    formButtons?: JSX.Element;
}

interface FormValues {
    subjectId: TSubjectId | null;
    landPartId: TLandPartId | null;
    share: number;
    ownedPercentage: number;
}

const LandOwnershipEditorNew: React.FC<LandOwnershipEditorProps> = ({ landOwnershipId, editorType, onClose, isEditorShowed, formButtons = (<></>) }) => {
    const { insert, update } = useEvolu();
        const [loadingData, setLoadingData] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            subjectId: null,
            landPartId: null,
            share: 0,
            ownedPercentage: 0
        }
    });
    
    useEffect(() => {
        if (isEditorShowed) {
            // Reset form values based on type
            if (editorType === "create") {
                setValue('subjectId', null);
                setValue('landPartId', null);
                setValue('share', 0);
            }

            // Fetch subject data if editing
            if (editorType === "edit" && landOwnershipId) {
                setLoadingData(true);
                getLandOwnership(landOwnershipId).then((result) => {
                    const landOwnership = result[0];
                    if (landOwnership) {
                        setValue('subjectId', landOwnership.subjectId as TSubjectId);
                        setValue('landPartId', landOwnership.landPartId as TLandPartId);
                        setValue('share', landOwnership.share as number);
                    } else {
                        notifyError("Land ownership not found");
                    }
                    console.log("Fetched land ownership:", result);
                    setLoadingData(false);
                }).catch((error) => {
                    console.error("Error fetching land ownership:", error);
                    notifyError("Failed to fetch land ownership");
                    setLoadingData(false);
                });
            }
        }

    }, [isEditorShowed]);

    const landPartId = useWatch({
        control,
        name: 'landPartId',
    });
    useEffect(() => {
        console.log('Values changed:', landPartId);
    }, [landPartId]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        let landPart: TLandPartId | null = data.landPartId;
        let subject: TSubjectId | null = data.subjectId;

        if (editorType === "edit" && landOwnershipId) {
            const landPartUpdateResult = update('landOwnership', {
                id: landOwnershipId,
                landPartId: landPart,
                subjectId: subject,
                share: data.share
            });
            if (landPartUpdateResult.ok) {
                console.log("Land ownership updated successfully:", landPartUpdateResult);
                notifySuccess("Successfully updated");
                reset();
                onClose();
            } else {
                console.error("Error updating land part:", landPartUpdateResult.error);
                notifyError("Update failed");
            }

        } else if (editorType === "create") {
            const landPartInsertResult = insert('landOwnership', {
                landPartId: landPart,
                subjectId: subject,
                share: data.share
            });

            if (landPartInsertResult.ok) {
                console.log("Land ownership stored successfully:", landPartInsertResult);
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
                    name="landPartId"
                    control={control}
                    render={({ field }) => (
                        <LandPartPicker {...field} />
                    )}
                />
                <Controller
                    name="subjectId"
                    control={control}
                    render={({ field }) => (
                        <SubjectPicker {...field} />
                    )}
                />
                <Controller
                    name="share"
                    control={control}
                    render={({ field }) => (
                        <FractionInput {...field} value={field.value} onChange={field.onChange} label="Fraction" required />
                    )}
                />
            </Box>

            {formButtons}

        </form>
    );
}

export default LandOwnershipEditorNew;