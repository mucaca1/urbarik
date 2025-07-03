import { toast, ToastOptions } from "react-toastify";

const toastSettings: ToastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark'
}

export const notifySuccess = (msg: string) => toast.success(msg, toastSettings);

export const notifyError = (msg: string) => toast.error(msg, toastSettings);

export const notifyWarning = (msg: string) => toast.warning(msg, toastSettings);

export const notifyInfo = (msg: string) => toast.info(msg, toastSettings);