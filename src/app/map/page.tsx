'use client'

import withAuth from '../../components/withAuth';
import Map from '../../components/Map'

const myProfile = () => {
  return (
    <Map />
  )
}

const Profile = withAuth(myProfile);
export default Profile;