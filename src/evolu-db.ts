import {
    createEvolu,
    getOrThrow,
    id,
    Int,
    maxLength,
    NonEmptyString,
    nullOr,
    SimpleName
} from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";

const SubjectId = id("SubjectId");
type TSubjectId = typeof SubjectId.Type;

const AddressId = id("AddressId");
type TAddressId = typeof AddressId.Type;

const NonEmptyString50 = maxLength(50)(NonEmptyString);
type TNonEmptyString50 = typeof NonEmptyString50.Type;

const Subject = {
    id: SubjectId,
    name: NonEmptyString50,
    surname: NonEmptyString50,
    addressId: nullOr(AddressId)
};

const Address = {
    id: AddressId,
    street: NonEmptyString50,
    postCode: Int,
    city: NonEmptyString50
}

const Schema = {
    subject: Subject,
    address: Address
};

export const evolu = createEvolu(evoluReactWebDeps)(Schema, {
    reloadUrl: "/",
    name: getOrThrow(SimpleName.from("urbarik")),

    ...(process.env.NODE_ENV === "development" && {
        syncUrl: "http://localhost:4000",
    }),

    initialData: (evolu) => {
        console.log("Init data")
        const address = evolu.insert('address', {
            city: "Trenčín", postCode: 91101, street: "Bojnicnká"
        })
        if (address.ok) {
            evolu.insert('subject', {
                name: "Matej", surname: "Mrkva", addressId: address.value.id
            });
        }
    },

    indexes: (create) => [
    ],

    // enableLogging: true,
});