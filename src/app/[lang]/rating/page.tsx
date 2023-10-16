'use client'

import UsersRating from '@/components/UsersRating'
import { WithAuth } from '@/components/WithAuth'
import { Props } from '@/utils/Props'

const Raiting = (props: Props) => {
    return <UsersRating {...props} />
}

const Page = WithAuth(Raiting)
export default Page
