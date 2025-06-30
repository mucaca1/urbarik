import {
    EvoluProvider,
    useAppOwner,
    useQuery,
} from "@evolu/react";
import { memo, Suspense } from "react";
import { evolu } from "./evolu-db";
import { SettingsScreen } from "./screens/settings-screen";
import MenuBar from "./components/menu";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomeScreen } from "./screens/home-screen";
import { ThemeProvider } from "./context/ThemeContext";
import React from "react";
import { UnitProvider } from "./context/UnitContext";

export const Urbarik = memo(function Urbarik() {
    return (
        <div>
            <EvoluProvider value={evolu}>
                <React.StrictMode>
                    <ThemeProvider>
                        <UnitProvider>
                            <BrowserRouter>
                                <MenuBar />
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
                        </UnitProvider>
                    </ThemeProvider>
                </React.StrictMode>
            
            </EvoluProvider>
        </div>
    );
});