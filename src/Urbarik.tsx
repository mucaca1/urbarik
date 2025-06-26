import {
    EvoluProvider,
    useAppOwner,
    useQuery,
} from "@evolu/react";
import { memo, Suspense, FC, useState } from "react";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { evolu } from "./evolu-db";
import { getAllSubjectsQuery, TAllSubjectsRow } from "./evolu-queries";
import { SettingsScreen } from "./screens/settings-screen";
import MenuBar from "./components/menu";
import { BrowserRouter, NavLink, Route, Router, Routes } from "react-router-dom"
import { HomeScreen } from "./screens/home-screen";

export const Urbarik = memo(function Urbarik() {
    return (
        <div>
            <EvoluProvider value={evolu}>
                <BrowserRouter>
                        <MenuBar/>
                        <Suspense >
                            <div style={{ maxWidth: "90%", padding: "2rem" }}>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<HomeScreen />}
                                    />
                                    <Route
                                        path="/settings"
                                        element={<SettingsScreen />}
                                    />
                                </Routes>

                            </div>
                        </Suspense>
                    </BrowserRouter>
            </EvoluProvider>
        </div>
    );
});

const Subjects: FC = () => {
    const rows = useQuery(getAllSubjectsQuery);
    console.log(rows.length)

    const owner = useAppOwner();
    if (owner) console.log(owner.mnemonic);
    return (
        <div>
            <Button onClick={() => evolu.resetAppOwner()}>Restart local data</Button>
            <h2>Subjects</h2>
            <ul style={{ margin: 0, padding: 0 }}>
                {rows.map((row) => (
                    <SubjectElement key={row.id} row={row} />
                ))}
            </ul>
        </div>
    );
  };

const SubjectElement = memo<{
    row: TAllSubjectsRow;
}>(function SubjectElement({
    row: { id, name },
}) {
    return (
        <li>
                <label>
                    <span>
                        {name}
                    </span>
                </label>
        </li>
    );
});