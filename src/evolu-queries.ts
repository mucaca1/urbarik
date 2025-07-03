import { evolu } from "./evolu-db";
import { Subject } from "@mui/icons-material";
import { err, kysely, ok } from "@evolu/common";
import { TSubjectId } from "./evolu-db"

const queryOptions = {
    logQueryExecutionTime: process.env.NODE_ENV === "development",
    logExplainQueryPlan: process.env.NODE_ENV === "development",
};

export const getAllSubjectsQuery = evolu.createQuery((db) =>
    db.selectFrom("subject")
        .select(["id", "firstName", "lastName", "nationalIdNumber", "street", "houseNumber", "postCode", "city"])
        .where("isDeleted", "is not", 1), queryOptions,
);
export type TAllSubjectsRow = typeof getAllSubjectsQuery.Row;

const getSubjectQuery = (subjectId: TSubjectId) => 
    evolu.createQuery((db) =>
        db.selectFrom("subject")
            .select(["id", "firstName", "lastName", "nationalIdNumber", "street", "houseNumber", "postCode", "city"])
            .where("isDeleted", "is not", 1)
            .where("id", "=", subjectId).limit(1), queryOptions,
    );

export const getSubject = async (subjectId: TSubjectId) => {
    const subjectRows = await evolu.loadQuery(getSubjectQuery(subjectId));
    return ok({ subjectRows })
}