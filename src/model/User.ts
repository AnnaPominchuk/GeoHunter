import UserRole from "@/utils/UserRole";

export default interface User{
    _id: string,
    email: string,
    name: string,
    lastname: string,
    rating: number,
    useGooglePhoto: boolean,
    profilePhoto: string,
    profilePhotoURL: string,
    roles: UserRole[]
}