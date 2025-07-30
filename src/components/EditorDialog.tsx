import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Transition } from "../utils/transition";
import { ToastContainer } from "react-toastify";
import { JSX } from "react";

interface SubjectEditorProps {
    title: string,
    showDialog: boolean,
    setShowDialog: (v: boolean) => void,
    dialogContent: () => JSX.Element,
}
const EditorDialog: React.FC<SubjectEditorProps> = ({ title, showDialog, setShowDialog, dialogContent }) => {
    return (<div>
        <ToastContainer />
        <Dialog
            maxWidth="md"
            open={showDialog}
            aria-labelledby="scroll-dialog-title"
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={() => setShowDialog(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
                
            <DialogContent>
                {dialogContent()}
            </DialogContent>
        </Dialog>
    </div>);
}

export default EditorDialog;