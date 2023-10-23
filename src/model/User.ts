// To parse this data:
//
//   import { Convert, User } from "./file";
//
//   const user = Convert.toUser(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import UserRole from '@/utils/UserRole'

import {cast, uncast, o, u, r, a} from '@/model/Converter'

export interface User {
    _id:             string;
    email:           string;
    name:            string;
    rating:          number;
    useGooglePhoto:  boolean;
    profilePhotoKey: string;
    profilePhotoURL: string;
    roles:           UserRole[];
}

const typeMap: any = {
    "User": o([
        { json: "_id", js: "_id", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "lastname", js: "lastname", typ: "" }, // TO DO: remove lastname
        { json: "rating", js: "rating", typ: 0 },
        { json: "useGooglePhoto", js: "useGooglePhoto", typ: true },
        { json: "profilePhotoKey", js: "profilePhotoKey", typ: u(undefined, "") },
        { json: "profilePhotoURL", js: "profilePhotoURL", typ: u(undefined, "") },
        { json: "roles", js: "roles", typ: a("") },
    ], 0),
};

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toUser(json: string): User {
        return cast(JSON.parse(json), r("User"), typeMap);
    }

    public static userToJson(value: User): string {
        return JSON.stringify(uncast(value, r("User"), typeMap), null, 2);
    }
}