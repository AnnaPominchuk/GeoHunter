'use client'

import { useState, useEffect } from 'react';

import User from '../../../model/User'

export default function ProfilePhoto( { params : { user, updProfilePhotoKey } }: 
    { params: { user: User | null, updProfilePhotoKey: {key: string} | null } } ) {

    const [profilePhotoKey, setProfilePhotoKey] = useState<{key: string} | null>(null)

    useEffect(() => {
        if (updProfilePhotoKey)
            setProfilePhotoKey(updProfilePhotoKey)
        else
            setProfilePhotoKey({ key: user?.profilePhotoKey ?? '' })
    }, [user, updProfilePhotoKey])

    return (
        <>
            {
                user && 
                (
                    user.useGooglePhoto ? 
                    <img
                        src={`${user?.profilePhotoURL}`}
                        alt=""
                        width={200}
                        height={200}    
                        
                    /> : 
                    (
                        profilePhotoKey && 
                        ( 
                        profilePhotoKey.key?.length ?
                        <img
                            src={`../api/profile-photo/${profilePhotoKey.key}`}
                            alt=""
                            width={200}
                            height={200}    
                            loading="lazy"
                        /> 
                        : <img
                            src='/../../images/no-pic-prof.jpeg'
                            alt=""
                            width={200}
                            height={200}    
                            loading="lazy"
                        />
                        ) 
                    )
                )
                }
        </>
    );
}
