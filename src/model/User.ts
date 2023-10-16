import UserRole from "@/utils/UserRole";

export default interface User{
    _id: string,
    email: String,
    name: String,
    rating: number,
    useGooglePhoto: boolean,
    profilePhotoKey: string,
    profilePhotoURL: string,
    roles: UserRole[]
}