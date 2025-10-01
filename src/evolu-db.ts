import { string } from "@effect/schema/FastCheck";
import { NonNaNTypeId } from "@effect/schema/Schema";
import {
    createEvolu,
    DateIsoString,
    getOrThrow,
    id,
    Int,
    maxLength,
    NonEmptyString,
    NonNegativeInt,
    NonNegativeNumber,
    nullOr,
    PositiveNumber,
    SimpleName,
    SqliteBoolean
} from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";

const SubjectId = id("SubjectId");
export type TSubjectId = typeof SubjectId.Type;

const LandPartId = id("LandPartId");
export type TLandPartId = typeof LandPartId.Type;

const LandOwnershipId = id("LandOwnershipId");
export type TLandOwnershipId = typeof LandOwnershipId.Type;

const DividendId = id("DividendId");
export type TDividendId = typeof DividendId.Type;

const DividendBatchId = id("DividendBatchId");
export type TDividendBatchId = typeof DividendBatchId.Type;

const DividendToLandPartId = id("DividendToLandPartId");
export type TDividendToLandPartId = typeof DividendToLandPartId.Type;

const NonEmptyString50 = maxLength(50)(NonEmptyString);
type TNonEmptyString50 = typeof NonEmptyString50.Type;

export const Subject = {
    id: SubjectId,
    firstName: NonEmptyString50,
    lastName: NonEmptyString50,
    nationalIdNumber: NonEmptyString50,

    // # Address # //
    street: nullOr(NonEmptyString50),
    houseNumber: nullOr(NonEmptyString50),
    postCode: nullOr(NonNegativeInt),
    city: nullOr(NonEmptyString50)
};

export const LandPart = {
    id: LandPartId,
    certificateOfOwnership: NonEmptyString50,
    plotDimensions: NonNegativeNumber
}

export const LandOwnership = {
    id: LandOwnershipId,
    subjectId: SubjectId,
    landPartId: LandPartId,
    share: PositiveNumber
}

const Dividend = {
    id: DividendId,
    subjectId: SubjectId,
    amount: PositiveNumber,
    dividendBatchId: DividendBatchId,
    isPayed: SqliteBoolean
}

const DividendBatch = {
    id: DividendBatchId,
    date: DateIsoString,
    totalAmount: PositiveNumber,
}

const DividendToLandPart = {
    id: DividendToLandPartId,
    dividendId: DividendId,
    landPartId: LandPartId
}

const Schema = {
    subject: Subject,
    landPart: LandPart,
    landOwnership: LandOwnership,
    dividend: Dividend,
    dividendBatch: DividendBatch,
    dividendToLandPart: DividendToLandPart
};

export const evolu = createEvolu(evoluReactWebDeps)(Schema, {
    reloadUrl: "/",
    name: getOrThrow(SimpleName.from("urbarik")),

    ...(process.env.NODE_ENV === "development" && {
        syncUrl: "http://localhost:4000",
    }),

    initialData: (evolu) => {
        console.log("Init data")
            evolu.insert('subject', {
                firstName: "Matej", lastName: "Mrkva", nationalIdNumber: "EC123GH5", street: "Beckovksa", houseNumber: "4578/1", postCode: 91101, city: "Trencin"
            });

        evolu.insert('landPart', {
            certificateOfOwnership: "EC123GH5", plotDimensions: 100
        });
    },

    indexes: (create) => [
    ],

    // enableLogging: true,
});