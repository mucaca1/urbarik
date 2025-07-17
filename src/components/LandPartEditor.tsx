import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
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
import { useState } from "react";

interface LandPartEditorProps {
    landPartId: TLandPartId | null,
    showDialog: boolean,
    editorType: EditorType | null,
    setShowDialog: (v: boolean) => void,
}

interface FormValues {
    certificateOfOwnership: string;
    plotDimensions: string;
}

const LandPartEditor: React.FC<LandPartEditorProps> = ({ landPartId, showDialog, editorType, setShowDialog }) => {
    const { insert, update } = useEvolu();

    const {
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            certificateOfOwnership: '',
            plotDimensions: ''
        }
    });

    // Reset form values based on type
    if (editorType === "create") {
        setValue('certificateOfOwnership', '');
        setValue('plotDimensions', '');
    }

    // Fetch subject data if editing
    if (editorType === "edit" && landPartId) {
        getLandPart(landPartId).then((result) => {
            const landPart = result[0];
            if (landPart) {
                setValue('certificateOfOwnership', landPart.certificateOfOwnership as string);
                setValue('plotDimensions', landPart.plotDimensions as string);
            } else {
                notifyError("Land part not found");
            }
            console.log("Fetched land part:", result);
        }).catch((error) => {
            console.error("Error fetching land part:", error);
            notifyError("Failed to fetch land data");
        });
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        let certificateOfOwnership = nullEmptyValue(data.certificateOfOwnership);
        let plotDimensions = nullEmptyValue(data.plotDimensions);
        if (certificateOfOwnership === null || certificateOfOwnership === undefined) {
            certificateOfOwnership = '';
        }
        if (plotDimensions === null || plotDimensions === undefined) {
            plotDimensions = '';
        }

        if (editorType === "edit" && landPartId) {
            const landPartUpdateResult = update('landPart', {
                id: landPartId,
                certificateOfOwnership: certificateOfOwnership,
                plotDimensions: plotDimensions?.length > 0 ? Number.parseInt(plotDimensions) : null
            });
            if (landPartUpdateResult.ok) {
                console.log("Ladn part updated successfully:", landPartUpdateResult);
                notifySuccess("Successfully updated");
                reset();
                setShowDialog(false);
            } else {
                console.error("Error updating land part:", landPartUpdateResult.error);
                notifyError("Update failed");
            }

        } else if (editorType === "create") {
            const landPartInsertResult = insert('landPart', {
                certificateOfOwnership: certificateOfOwnership,
                plotDimensions: plotDimensions?.length > 0 ? Number.parseInt(plotDimensions) : null
            });

            if (landPartInsertResult.ok) {
                console.log("Land part stored successfully:", landPartInsertResult);
                notifySuccess("Successfully stored");
                reset();
                setShowDialog(false);
            } else {
                console.error("Error storing land part:", landPartInsertResult.error);
                notifyError("Stored failed");
            }
        }
    };

    return (<div>
        <ToastContainer />
        <Dialog
            open={showDialog}
            aria-labelledby="scroll-dialog-title"
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={() => setShowDialog(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="scroll-dialog-title">{"Land part"}</DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', sm: 'column' }}
                        gap={2}
                        paddingTop="5%"
                    >
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
                                baseValue={Number.parseInt(field.value)}
                                    onBaseValueChange={(valueInM2: number) => setValue("plotDimensions", valueInM2.toString())} />
                            )}
                        />
                    </Box>

                    <DialogActions>
                        <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    </div>);
}

const nullEmptyValue = (value: string): string | null => {
    if (value === "") {
        return null;
    }
    return value;
}

export default LandPartEditor;