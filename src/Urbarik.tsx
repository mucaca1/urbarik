import {
    EvoluProvider,
    useAppOwner,
    useQuery,
} from "@evolu/react";
import { memo, Suspense, FC, useState } from "react";
import { Button } from "@mui/material";
import { evolu } from "./evolu-db";
import { getAllSubjectsQuery, TAllSubjectsRow } from "./evolu-queries";

export const Urbarik = memo(function Urbarik() {
    return (
        <div>
            <div>
                <EvoluProvider value={evolu}>
                    <Suspense>
                        <Subjects/>
                    </Suspense>
                </EvoluProvider>
            </div>
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