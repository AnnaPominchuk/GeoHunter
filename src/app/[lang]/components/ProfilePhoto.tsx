'use client'

import { useState, useEffect } from 'react'

import { User } from '../../../model/User'

import Image from 'next/image'

export default function ProfilePhoto({
    params: { user, updProfilePhotoKey, width },
}: {
    params: { user: User | null; updProfilePhotoKey: { key: string } | null; width: number }
}) {
    const [profilePhotoKey, setProfilePhotoKey] = useState<{
        key: string
    } | null>(null)

    useEffect(() => {
        if (updProfilePhotoKey) setProfilePhotoKey(updProfilePhotoKey)
        else setProfilePhotoKey({ key: user?.profilePhotoKey ?? '' })
    }, [user, updProfilePhotoKey])

    return (
        <>
            {user &&
                (user.useGooglePhoto ? (
                    <Image
                        src={`${user?.profilePhotoURL}`}
                        alt=''
                        width={width}
                        height={width}
                    />
                ) : (
                    profilePhotoKey &&
                    (profilePhotoKey.key?.length ? (
                        <Image
                            src={`../api/profile-photo/${profilePhotoKey.key}`}
                            alt=''
                            width={width}
                            height={width}
                            loading='lazy'
                        />
                    ) : (
                        <Image
                            src='/../../images/no-pic-prof.jpeg'
                            alt=''
                            width={width}
                            height={width}
                            loading='lazy'
                        />
                    ))
                ))}
        </>
    )
}
