import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField, Typography } from "@mui/material";
import { Transition } from "../utils/transition";
import { useEvolu, useQuery } from "@evolu/react";
import { notifyError, notifySuccess } from "../utils/toastNotification";
import { TSubjectId } from "../evolu-db";
import { ToastContainer } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getSubject } from "../evolu-queries";
import { EditorType } from "../types";
import { JSX, useEffect, useState } from "react";

interface SubjectEditorProps {
    subjectId: TSubjectId | null,
    editorType: EditorType | null,
    onClose: () => void
    isEditorShowed: boolean
    formButtons?: JSX.Element;
}

interface FormValues {
    firstName: string;
    lastName: string;
    nationalIdentificationNumber: string;
    street: string;
    houseNumber: string;
    postcode: string;
    city: string;
}

const SubjectEditor: React.FC<SubjectEditorProps> = ({ subjectId, editorType, onClose, isEditorShowed, formButtons = (<></>) }) => {
    const { insert, update } = useEvolu();
    const [loadingData, setLoadingData] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            firstName: '',
            lastName: '',
            nationalIdentificationNumber: '',
            street: '',
            houseNumber: '',
            postcode: '',
            city: ''
        }
    });

    useEffect(() => {
        if (isEditorShowed) {
            // Reset form values based on type
            if (editorType === "create") {
                setValue('firstName', '');
                setValue('lastName', '');
                setValue('nationalIdentificationNumber', '');
                setValue('street', '');
                setValue('houseNumber', '');
                setValue('postcode', '');
                setValue('city', '');
            }

            // Fetch subject data if editing
            if (editorType === "edit" && subjectId) {
                setLoadingData(true);
                getSubject(subjectId).then((result) => {
                    const subject = result[0];
                    if (subject) {
                        setValue('firstName', subject.firstName as string);
                        setValue('lastName', subject.lastName as string);
                        setValue('nationalIdentificationNumber', subject.nationalIdNumber as string);
                        setValue('street', subject.street as string || '');
                        setValue('houseNumber', subject.houseNumber as string || '');
                        setValue('postcode', subject.postCode as string || '');
                        setValue('city', subject.city as string || '');
                    } else {
                        notifyError("Subject not found");
                    }
                    console.log("Fetched subject:", result);

                    setLoadingData(false);
                }).catch((error) => {
                    console.error("Error fetching subject:", error);
                    notifyError("Failed to fetch subject data");

                    setLoadingData(false);
                });
            }
        }
    }, [isEditorShowed]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const street = nullEmptyValue(data.street);
        const houseNumber = nullEmptyValue(data.houseNumber);
        let postcode: String | null = nullEmptyValue(data.postcode);
        if (postcode === null || postcode === undefined) {
            postcode = '';
        }
        const city = nullEmptyValue(data.city);

        if (editorType === "edit" && subjectId) {
            const subjectUpdateResult = update('subject', {
                id: subjectId,
                firstName: data.firstName,
                lastName: data.lastName,
                nationalIdNumber: data.nationalIdentificationNumber, street: street, houseNumber: houseNumber, postCode: postcode?.length > 0 ? Number.parseInt(postcode.toString()) : null, city: city
            });
            if (subjectUpdateResult.ok) {
                console.log("Subject updated successfully:", subjectUpdateResult);
                notifySuccess("Successfully updated");
                reset();
            } else {
                console.error("Error updating subject:", subjectUpdateResult.error);
                notifyError("Update failed");
            }
        } else if (editorType === "create") {
            const subjectInsertResult = insert('subject', {
                firstName: data.firstName, lastName: data.lastName, nationalIdNumber: data.nationalIdentificationNumber,
                street: street, houseNumber: houseNumber, postCode: postcode?.length > 0 ? Number.parseInt(postcode.toString()) : null, city: city
            })

            if (subjectInsertResult.ok) {
                console.log("Subject stored successfully:", subjectInsertResult);
                notifySuccess("Successfully stored");
                reset();
            } else {
                console.error("Error storing subject:", subjectInsertResult.error);
                notifyError("Stored failed");
            }
        }
        onClose();
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
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="First name" fullWidth required />
                    )}
                />
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="Last name" fullWidth required />
                    )}
                />
                <Controller
                    name="nationalIdentificationNumber"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="National identification number"
                            fullWidth
                            required
                        />
                    )}
                />

                <Typography variant="h6">Address</Typography>

                <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="Street" fullWidth />
                    )}
                />
                <Controller
                    name="houseNumber"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="House number" fullWidth />
                    )}
                />
                <Controller
                    name="postcode"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Postcode"
                            type="number"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="City" fullWidth />
                    )}
                />
            </Box>

            {formButtons}

        </form>
    );
}

const nullEmptyValue = (value: string): string | null => {
    if (value === "") {
        return null;
    }
    return String(value);
}

export default SubjectEditor;