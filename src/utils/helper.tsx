import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const BlockboltStoreUrl = "https://store.blockbolt.io/mocha";
export const BlockboltUrl = "https://blockbolt.io";
export const toastMessage = (data: any) =>
    toast(data, {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });