import {
    EvoluProvider,
    useAppOwner,
    useQuery,
} from "@evolu/react";
import { memo, Suspense, FC, useState } from "react";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { evolu } from "./evolu-db";
import { SettingsScreen } from "./screens/settings-screen";
import MenuBar from "./components/menu";
import { BrowserRouter, NavLink, Route, Router, Routes } from "react-router-dom"
import { HomeScreen } from "./screens/home-screen";
import { ThemeProvider } from "./ThemeContext";
import React from "react";

export const Urbarik = memo(function Urbarik() {
    return (
        <div>
            <EvoluProvider value={evolu}>
                <React.StrictMode>
                    <ThemeProvider>
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
                    </ThemeProvider>
                </React.StrictMode>
            
            </EvoluProvider>
        </div>
    );
});