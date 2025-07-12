import React, { useEffect, useState } from 'react';
import { Box, Fab, Tooltip, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import { TSubjectId, TLandPartId, TLandOwnershipId } from '../evolu-db';
import { EditorType } from '../types';
import SubjectEditor from './SubjectEditor';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditorOptionsButtonBarProps {
    subjectId: TSubjectId | null,
    landPartId: TLandPartId | null,
    ownershipId: TLandOwnershipId | null,
}

const EditorOptionsButtonBar: React.FC<EditorOptionsButtonBarProps> = ({subjectId}) => {
    const [subjectEditor, setSubjectEditor] = useState<{visible: boolean, editorType: EditorType | null}>({visible: false, editorType: null});
    const [landPartEditor, setLandPartEditor] = useState<{ visible: boolean, editorType: EditorType | null }>({ visible: false, editorType: null });
    const [ownershipEditor, setOwnershipEditor] = useState<{ visible: boolean, editorType: EditorType | null }>({ visible: false, editorType: null });
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [modifyOpen, setModifyOpen] = useState<boolean>(false);

    useEffect(() => {
        setModifyOpen(subjectId !== null);
    }, [subjectId]);

    const handleToggle = () => {
        setAddOpen((prev) => !prev);
    };

    const setShowAddSubject = (show: boolean, editorType?: EditorType) => {
        setSubjectEditor({ visible: show, editorType: editorType ? editorType : null });
    }

    return (
        <div>
            <SubjectEditor
                subjectId={subjectId}
                showDialog={subjectEditor.visible}
                type={subjectEditor.editorType}
                setShowDialog={setShowAddSubject}
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
                            onClick={() => setShowAddSubject(true, "create")}
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
                                onClick={() => setShowAddSubject(true, "edit")}
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