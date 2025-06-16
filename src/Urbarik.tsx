import {
    createEvolu,
    getOrThrow,
    SimpleName,
} from "@evolu/common";
import {
    EvoluProvider,
} from "@evolu/react";
import { evoluReactWebDeps } from "@evolu/react-web";
import Button from "@mui/material/Button";
import React from "react";
import { memo, } from "react";

const Schema = {

};

const evolu = createEvolu(evoluReactWebDeps)(Schema, {
    reloadUrl: "/",
    name: getOrThrow(SimpleName.from("evolu-react-electron-example")),

    ...(process.env.NODE_ENV === "development" && {
        syncUrl: "http://localhost:4000",
    }),

    initialData: (evolu) => {
    },

    indexes: (create) => [
    ],

    // enableLogging: true,
});

export const Urbarik = memo(function Urbarik() {
    return (
        <div>
            <div>
                <EvoluProvider value={evolu}>
                    <Button variant="contained">Hello world</Button>
                </EvoluProvider>
            </div>
        </div>
    );
});