/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
// To parse this data:
//
//   import { Convert, Review } from "./file";
//
//   const Review = Convert.toReview(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import { cast, uncast, o, u, r, a } from '@/model/Converter'

export enum ReviewStatus {
    InReview = 'InReview',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export enum OverallRating {
    Fine = 'Fine',
    MaybeSuspicious = 'MaybeSuspicious',
    ObviouslySuspicious = 'ObviouslySuspicious',
}

export interface Review {
    name: string
    latitude?: number
    longitude?: number
    review?: string
    shopId: string
    userId: string
    status: ReviewStatus
    images: string[]
    _id: string
    rating: number
    address: string
    overallRating: OverallRating
    hasSupportBoard: boolean
    hasOpenHoursAdded: boolean
}

const typeMap: any = {
    Review: o(
        [
            { json: 'name', js: 'name', typ: '' },
            { json: 'latitude', js: 'latitude', typ: u(null, 0) },
            { json: 'longitude', js: 'longitude', typ: u(null, 0) },
            { json: 'review', js: 'review', typ: u(undefined, '') },
            { json: 'shopId', js: 'shopId', typ: '' },
            { json: 'userId', js: 'userId', typ: '' },
            { json: 'status', js: 'status', typ: '' },
            { json: 'images', js: 'images', typ: a('string') },
            { json: '_id', js: '_id', typ: '' },
            { json: 'rating', js: 'rating', typ: u(null, undefined, 0) },
            { json: 'address', js: 'address', typ: u(undefined, '') },
            { json: 'overallRating', js: 'overallRating', typ: '' },
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
        ],
        0
    ),
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toReview(json: string): Review {
        return cast(JSON.parse(json), r('Review'), typeMap)
    }

    public static ReviewToJson(value: Review): string {
        return JSON.stringify(uncast(value, r('Review'), typeMap), null, 2)
    }
}

export class ReviewStatusConvert {
    public static toText(status: ReviewStatus): string {
        switch (status) {
            case ReviewStatus.InReview:
                return 'In review'
            case ReviewStatus.Approved:
                return 'Approved'
            case ReviewStatus.Rejected:
                return 'Rejected'
            default:
                return 'Unknown status'
        }
    }

    public static toColor(
        status: ReviewStatus
    ):
        | 'default'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning'
        | undefined {
        switch (status) {
            case ReviewStatus.InReview:
                return 'primary'
            case ReviewStatus.Approved:
                return 'success'
            case ReviewStatus.Rejected:
                return 'error'
            default:
                return 'primary'
        }
    }

    public static toColorText(
        status: ReviewStatus
    ):
        | 'default'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning'
        | 'green'
        | undefined {
        switch (status) {
            case ReviewStatus.InReview:
                return 'primary'
            case ReviewStatus.Approved:
                return 'green'
            case ReviewStatus.Rejected:
                return 'error'
            default:
                return 'primary'
        }
    }
}
