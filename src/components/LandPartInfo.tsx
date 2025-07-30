import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Owner {
    id: string;
    name: string;
    share: number; // e.g. 0.5 for 50%
}

interface LandPartInfoProps {
    landPartId: string;
    totalSize: number; // in m²
    owners: Owner[];
}

const LandPartInfo: React.FC<LandPartInfoProps> = ({
    landPartId,
    totalSize,
    owners,
}) => {
    const totalOwned = owners.reduce((sum, o) => sum + o.share, 0);
    const freeShare = Math.max(0, 1 - totalOwned);

    let rows = [
        ...owners.map((owner) => ({
            id: owner.id,
            name: owner.name,
            share: `${(owner.share * 100).toFixed(2)}%`,
            area: `${(owner.share * totalSize).toFixed(2)} m²`,
        })),
        ...(freeShare > 0
            ? [
                {
                    id: 'unallocated',
                    name: 'Unallocated',
                    share: `${(freeShare * 100).toFixed(2)}%`,
                    area: `${(freeShare * totalSize).toFixed(2)} m²`,
                },
            ]
            : []),
    ];

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Owner', flex: 1 },
        { field: 'share', headerName: 'Fraction', flex: 1 },
        { field: 'area', headerName: 'Area', flex: 1 },
    ];

    return (
        <Card sx={{ p: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Land Part ID: {landPartId}
                </Typography>

                <Typography variant="body1" gutterBottom>
                    Total Size: <strong>{totalSize.toLocaleString()} m²</strong> | Free Share: <strong>{(freeShare * 100).toFixed(2)}%</strong>
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                    Owner Details
                </Typography>

                <Box sx={{ height: 250, width: 400 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        hideFooter
                        disableColumnMenu
                        disableRowSelectionOnClick
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default LandPartInfo;
