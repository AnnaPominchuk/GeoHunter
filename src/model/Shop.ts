/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
// To parse this data:
//
//   import { Convert, Shop } from "./file";
//
//   const shop = Convert.toShop(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import { cast, uncast, o, u, r } from '@/model/Converter'

enum OverallRating {
    Fine = 'Fine',
    MaybeSuspicious = 'MaybeSuspicious',
    ObviouslySuspicious = 'ObviouslySuspicious',
}
export interface Shop {
    address: string
    amount: number
    county_id: number
    latitude: number
    longitude: number
    m_id?: number
    name: string
    requestor: string
    t_id?: number
    _id: string
    hasSupportBoard: boolean,
    hasOpenHoursAdded: boolean,
    overallRating: OverallRating
}

const typeMap: any = {
    Shop: o(
        [
            { json: 'address', js: 'address', typ: '' },
            { json: 'amount', js: 'amount', typ: 3.14 },
            { json: 'county_id', js: 'county_id', typ: 3.14 },
            { json: 'latitude', js: 'latitude', typ: 3.14 },
            { json: 'longitude', js: 'longitude', typ: 3.14 },
            { json: 'm_id', js: 'm_id', typ: u(0, undefined) },
            { json: 'name', js: 'name', typ: u(undefined, '') },
            { json: 'requestor', js: 'requestor', typ: '' },
            { json: 't_id', js: 't_id', typ: u(0, undefined) },
            { json: '_id', js: '_id', typ: '' },
            {
                json: 'hasSupportBoard',
                js: 'hasSupportBoard',
                typ: u(undefined, true),
            },
            {
                json: 'hasOpenHoursAdded',
                js: 'hasOpenHoursAdded',
                typ: u(undefined, true),
            },
            { json: 'overallRating', js: 'overallRating', typ: '' },
        ],
        'any'
    ),
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toShop(json: string): Shop {
        return cast(JSON.parse(json), r('Shop'), typeMap)
    }

    public static shopToJson(value: Shop): string {
        return JSON.stringify(uncast(value, r('Shop'), typeMap), null, 2)
    }
}
