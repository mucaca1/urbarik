import React, { JSX, useEffect, useState } from 'react';
import { Box, Button, DialogActions, Fab, Tooltip, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import { TSubjectId, TLandPartId, TLandOwnershipId } from '../evolu-db';
import { EditorType } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEvolu } from '@evolu/react';
import { notifyError, notifySuccess } from '../utils/toastNotification';
import EditorDialog from './EditorDialog';
import SubjectEditorNew from './SubjectEditor';
import LandPartEditorNew from './LandPartEditor';
import LandOwnershipEditorNew from './LandOwnershipEditor';

interface EditorOptionsButtonBarProps {
    dialogObject: {
        value: TSubjectId | TLandPartId | TLandOwnershipId | null;
        type: "subject" | "landPart" | "landOwnership" | null;
    }
}

const EditorOptionsButtonBar: React.FC<EditorOptionsButtonBarProps> = ({ dialogObject }) => {
    const { update } = useEvolu();
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [modifyOpen, setModifyOpen] = useState<boolean>(false);
    
    const [editorType, setEditorType] = useState<EditorType | null>(null);
    const [objectTypeToEdit, setObjectTypeToEdit] = useState<"subject" | "landPart" | "landOwnership" | null>(null);

    useEffect(() => {
        setModifyOpen(dialogObject.value !== null);
    }, [dialogObject]);

    const handleToggle = () => {
        setAddOpen((prev) => !prev);
    };

    const setShowModifyEditor = (show: boolean) => {
        setEditorType("edit");
        if (dialogObject.type === "subject") {
            setObjectTypeToEdit("subject");
        }
        else if (dialogObject.type === "landPart") {
            setObjectTypeToEdit("landPart");
        } else if (dialogObject.type === "landOwnership") {
            setObjectTypeToEdit("landOwnership");
        }
        setShowEditor(show);
    }

    const setShowAddSubject = () => {
        setEditorType("create");
        setObjectTypeToEdit("subject");
        setShowEditor(true);
    }

    const setShowAddLandPart = () => {
        setEditorType("create");
        setObjectTypeToEdit("landPart");
        setShowEditor(true);
    }

    const setShowAddLandOwnership = () => {
        setEditorType("create")
        setObjectTypeToEdit("landOwnership");
        setShowEditor(true);
    }

    const dialogActions: JSX.Element = (
        <DialogActions>
            <Button onClick={() => setShowEditor(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
                Save
            </Button>
        </DialogActions>
    );

    return (
        <div>
            <EditorDialog
                title={objectTypeToEdit === "subject" ? "Subject Editor" : objectTypeToEdit === "landPart" ? "Land Part Editor" : objectTypeToEdit === "landOwnership" ? "Land Ownership Editor" : "Editor"}
                showDialog={showEditor}
                setShowDialog={(show) => {
                    setShowEditor(show);
                }}
                dialogContent={() => {
                    if (objectTypeToEdit === "subject") {
                        return <SubjectEditorNew subjectId={dialogObject.value as TSubjectId} editorType={editorType} onClose={() => setShowEditor(false)} isEditorShowed={showEditor} formButtons={dialogActions}/>;
                    } else if (objectTypeToEdit === "landPart") {
                        return <LandPartEditorNew landPartId={dialogObject.value as TLandPartId} editorType={editorType} onClose={() => setShowEditor(false)} isEditorShowed={showEditor} formButtons={dialogActions} />;
                    } else if (objectTypeToEdit === "landOwnership") {
                        return <LandOwnershipEditorNew landOwnershipId={dialogObject.value as TLandOwnershipId} editorType={editorType} onClose={() => setShowEditor(false)} isEditorShowed={showEditor} formButtons={dialogActions} />;
                    }
                    return <>No content</>;
                }}
            />
            <Box
                sx={{
                    gap: 2,
                    padding: 2,
                    //border: '1px solid #ccc',
                }}
            >
                {/* Main toggle button */}
                <Tooltip title={addOpen ? "Close" : "Add"} placement="bottom">
                    <Fab
                        onClick={handleToggle}
                        color={addOpen ? 'error' : 'success'}
                        sx={{
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        {addOpen ? <CloseIcon /> : <AddIcon />}
                    </Fab>
                </Tooltip>

                {/* Sub buttons */}
                <Zoom in={addOpen}>
                    <Tooltip title="Add subject" placement="bottom">
                        <Fab
                            onClick={setShowAddSubject}
                            color="success"
                            size="medium"
                            sx={{ marginLeft: 1 }}
                        >
                            <PersonAddIcon />
                        </Fab>
                    </Tooltip>
                </Zoom>

                <Zoom in={addOpen} style={{ transitionDelay: addOpen ? '50ms' : '0ms' }}>
                    <Tooltip title="Add land part" placement="bottom">
                        <Fab
                            onClick={setShowAddLandPart}
                            color="success"
                            size="medium"
                            sx={{ marginLeft: 1 }}
                        >
                            <AddHomeWorkIcon />
                        </Fab>
                    </Tooltip>
                </Zoom>

                <Zoom in={addOpen} style={{ transitionDelay: addOpen ? '100ms' : '0ms' }}>
                    <Tooltip title="Add ownership" placement="bottom">
                        <Fab
                            onClick={setShowAddLandOwnership}
                            color="success"
                            size="medium"
                            sx={{ marginLeft: 1 }}
                        >
                            <AddLocationAltIcon />
                        </Fab>
                    </Tooltip>
                </Zoom>

                <Box sx={{ float: "right" }}>
                    <Zoom in={modifyOpen} style={{ 
                            transitionDelay: modifyOpen ? '50ms' : '0ms',
                        }}>
                        <Tooltip title="Modify" placement="bottom">
                            <Fab
                                onClick={() => setShowModifyEditor(true)}
                                color="primary"
                                size="large"
                                sx={{ marginLeft: 1 }}
                                    >
                                <EditIcon />
                            </Fab>
                        </Tooltip>
                    </Zoom>
                    <Zoom in={modifyOpen} style={{
                        transitionDelay: modifyOpen ? '100ms' : '0ms',
                    }}>
                        <Tooltip title="Delete" placement="bottom">
                            <Fab
                                onClick={() => {
                                    if (dialogObject.value === null) {
                                        notifyError("No object selected for deletion");
                                        return;
                                    }
                                    if (dialogObject.type === "subject") {
                                        const subjectUdeleteResult = update("subject", { id: dialogObject.value, isDeleted: true })
                                        if (subjectUdeleteResult.ok) {
                                            console.log("Subject deleted successfully:", subjectUdeleteResult);
                                            notifySuccess("Successfully deleted");
                                        } else {
                                            console.error("Error deleting subject:", subjectUdeleteResult.error);
                                            notifyError("Delete failed");
                                        }
                                    } else if (dialogObject.type === "landPart") {
                                        const landPartDeleteResult = update("landPart", { id: dialogObject.value, isDeleted: true })
                                        if (landPartDeleteResult.ok) {
                                            console.log("Land part deleted successfully:", landPartDeleteResult);
                                            notifySuccess("Successfully deleted");
                                        } else {
                                            console.error("Error deleting land part:", landPartDeleteResult.error);
                                            notifyError("Delete failed");
                                        }
                                    } else if (dialogObject.type === "landOwnership") {
                                        const ownershipDeleteResult = update("landOwnership", { id: dialogObject.value, isDeleted: true })
                                        if (ownershipDeleteResult.ok) {
                                            console.log("Ownership deleted successfully:", ownershipDeleteResult);
                                            notifySuccess("Successfully deleted");
                                        } else {
                                            console.error("Error deleting ownership:", ownershipDeleteResult.error);
                                            notifyError("Delete failed");
                                        }
                                    }
                                }}
                                color="error"
                                size="large"
                                sx={{ marginLeft: 1 }}
                            >
                                <DeleteIcon />
                            </Fab>
                        </Tooltip>
                    </Zoom>
                </Box>
            </Box>
        </div>
    );
};

export default EditorOptionsButtonBar;