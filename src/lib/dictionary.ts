import type { Locale } from '@/config/i18n.config'

const dictionaries = {
    en: () =>
        import('../../dictionaries/en.json').then((module) => module.default),
    hu: () =>
        import('../../dictionaries/hu.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export interface Dictionary {
    adminMenu: AdminMenu
    csvUploadComponent: CSVUploadComponent
    map: Map
    reviews: Reviews
    rating: Rating
    form: Form
    login: Login
    profile: Profile
    navigation: Navigation
    common: Common
}

interface AdminMenu {
    mapUploadButton: string
    reviewsButton: string
}

interface Common {
    name: string
}

interface CSVUploadComponent {
    successMessage: string
    errorMessage: string
    capture: string
    uploadButton: string
    supportedFiles: string
}

interface Form {
    submittedMessage: string
    save: string
    cancel: string
    review: string
    backendError: string
    dropDownOption1: string
    dropDownOption2: string
    dropDownOption3: string
    overallRating: string
    hasSupportBoadrText: string
    provideSBPhotoText: string
    hasOpenHoursText: string
    provideOpenHoursPhotoText: string
    provideMorePhotosText: string
    address: string
}

interface Login {
    appName: string
    slogan: string
    joinUs: string
    joinUsLong: string
    logIn: string
}

interface Map {
    uploadInfoButton: string
    requestor: string
    address: string
    shopsCount: string
    supportBoardPresentText: string
    openingHoursPresentText: string
    noSupportBoardText: string
    noInfoAboutSB: string
}

interface Navigation {
    goBackButton: string
    closeButtob: string
    detailsButton: string
    profile: string
    logOut: string
    openMapButton: string
    openRatingButton: string
    aboutButton: string
}

interface Profile {
    uploadPhotobButton: string
    myReviews: string
    rating: string
}

interface Rating {
    leaderboard: string
}

interface Reviews {
    reviewsCaption: string
    approveButton: string
    rejectButton: string
    cancelButton: string
    applyButton: string
    blockAuthor: string
    unblockAuthor: string
    inReview: string
    approved: string
    rejected: string
    seeMore: string
    noReviews: string
    reviewDetails: string
    rateReview: string
    saveAddress: string
    saveOverallRating: string
    overallRating: string
    hint: string
    supportBoardPresentText: string
    openingHoursPresentText: string
    noSupportBoardText: string
}

export class ConvertDictionary {
    public static toDictionary(json: string): Dictionary {
        return JSON.parse(json)
    }

    public static dictionaryToJson(value: Dictionary): string {
        return JSON.stringify(value)
    }
}
