import { evolu } from "./evolu-db";
import { Subject } from "@mui/icons-material";
import { kysely } from "@evolu/common";

const queryOptions = {
    logQueryExecutionTime: process.env.NODE_ENV === "development",
    logExplainQueryPlan: process.env.NODE_ENV === "development",
};

export const getAllSubjectsQuery = evolu.createQuery((db) =>
    db.selectFrom("subject")
        .select(["id", "firstName", "lastName", "nationalIdNumber"])
        .where("isDeleted", "is not", 1)
        .select((eb) => [
            kysely.jsonObjectFrom(
                eb.selectFrom("address")
                .select(["city", "postCode", "street"])
                .where("isDeleted", "is not", 1)
                .whereRef("id", "=", "subject.addressId")
            )
                .as("address")
        ]), queryOptions,
);

export type TAllSubjectsRow = typeof getAllSubjectsQuery.Row;