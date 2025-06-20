import { evolu } from "./evolu-db";

const queryOptions = {
    logQueryExecutionTime: process.env.NODE_ENV === "development",
    logExplainQueryPlan: process.env.NODE_ENV === "development",
};

export const getAllSubjectsQuery = evolu.createQuery((db) =>
    db.selectFrom('subject').selectAll(), queryOptions,
);

export type TAllSubjectsRow = typeof getAllSubjectsQuery.Row;