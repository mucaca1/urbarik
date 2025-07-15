import { evolu, TLandPartId } from "./evolu-db";
import { QueryRows } from "@evolu/common";
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

type TGetSubjectRow = ReturnType<typeof getSubjectQuery>[number];

export const getSubject = async (subjectId: TSubjectId) => {
    const subjectRows: QueryRows = await evolu.loadQuery(getSubjectQuery(subjectId));
    return subjectRows
}

export const getAllLandPartQuery = evolu.createQuery((db) =>
    db.selectFrom("landPart")
        .select(["id", "certificateOfOwnership", "plotDimensions"])
        .where("isDeleted", "is not", 1), queryOptions,
);
export type TAllLandPartRow = typeof getAllLandPartQuery.Row;

export const getLandPart = async (landPartId: TLandPartId) => {
    const landPartRows: QueryRows = await evolu.loadQuery(
        evolu.createQuery((db) =>
            db.selectFrom("landPart")
                .select(["id", "certificateOfOwnership", "plotDimensions"])
                .where("isDeleted", "is not", 1)
                .where("id", "=", landPartId).limit(1), queryOptions,
        )
    );
    return landPartRows;
}