import UserRole from "@/utils/UserRole";

export default interface User{
    _id: string,
    email: String,
    name: String,
    lastname: String,
    rating: number,
    useGooglePhoto: boolean,
    profilePhoto: string,
    profilePhotoURL: string,
    roles: UserRole[]
}