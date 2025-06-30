import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AreaUnit = 'm2' | 'km2' | 'ha';

interface UnitContextProps {
    unit: AreaUnit;
    setAreaUnit: (unit: AreaUnit) => void;
    storeAreaUnit: (unit: AreaUnit) => void;
}

const UnitContext = createContext<UnitContextProps | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unit, setUnit] = useState<AreaUnit>('m2');

    useEffect(() => {
        const stored = localStorage.getItem('baseAreaUnit');
        if (stored === 'm2' || stored === 'km2' || stored === 'ha') {
            setUnit(stored);
        }
    }, []);

    const setAreaUnit = (newMode: AreaUnit) => {
        console.log('Area unit changed')
        setUnit(newMode);
    };

    const storeAreaUnit = (newMode: AreaUnit) => {
        console.log('Area unit stored')
        localStorage.setItem('baseAreaUnit', newMode);
    };

    return (
        <UnitContext.Provider value={{ unit, setAreaUnit, storeAreaUnit }}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnit = (): UnitContextProps => {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
};
