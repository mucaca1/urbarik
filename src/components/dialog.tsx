import React, { FC } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface QuestionDialogProps {
    question: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

export const QuestionDialog: FC<QuestionDialogProps> = ({question, open, onClose, onConfirm}) => {
    return (
        <Dialog open={open} onClose={onClose}
            slots={{
                transition: Transition,
            }}
          keepMounted>
            <DialogTitle>Confirmation Required</DialogTitle>
            <DialogContent>
                <DialogContentText>{question}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};