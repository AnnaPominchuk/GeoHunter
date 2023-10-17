'use client'

import {useState, useEffect} from 'react'
import User from '@/model/User'

import { 
    Box, 
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography
} from '@mui/material';

import ProfilePhoto from '../components/ProfilePhoto';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { getDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'

import UserRole from '@/utils/UserRole'

import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { yellow, deepPurple, grey, orange } from '@mui/material/colors';

const UsersRating = ({params} : Props) => {

    const [ dictionary, setDictionary ] = useState<any>()
    useEffect(() => {
        const setDict = async() => {
        const dict = await getDictionary(params.lang)
        setDictionary(dict)
      }   

      setDict()
    }, [params.lang])

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function geUsers() {
            const res = await fetch('../api/user', {
                method: 'GET'
            });
                
            const obj = await res.json();

            if (obj.status == 200) 
              setUsers(obj.data.users.filter((user:User) => {
                return !user.roles?.includes(UserRole.ADMIN)
              }));
        }

        geUsers()

        users.sort((l : User, r : User) : number => { 
            if (l.rating === r.rating) return 0;
            return (l.rating > r.rating ? 1 : -1) 
        })
    },[users])

    const getCupIconStyle = (pos: number): {color: string, fontSize: number} => {
      if (pos == 0)
        return { color: yellow['700'], fontSize: 40 }
      else if (pos == 1)
        return { color: grey['400'], fontSize: 40 }
      else
        return { color: orange['700'], fontSize: 40 }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh', flexDirection:'column'}} bgcolor="secondary.main">
          
          <Typography variant="button" sx={{marginTop: "25px"}} > {dictionary ? dictionary.rating.leaderboard : ''} </Typography>

          <TableContainer component={Paper} sx={{ width:'90%', mt:'20px' }}> 
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableBody>
                {users?.map((user, pos) => (
                    <TableRow
                      key={user.name}
                      sx={{ height:"50px" }}
                    >
                      <TableCell align="left">
                        <div style={{ borderRadius: '50%', overflow: 'hidden', width: '50px', height: '50px' }}>
                          <ProfilePhoto params={{user}}/>
                        </div>
                      </TableCell>
                      <TableCell align="left">{user.name}</TableCell>
                      <TableCell align="left" color="inherit" >
                        {user.rating}
                      </TableCell>
                      <TableCell align="left">
                        { pos < 3 ? <EmojiEventsIcon style={getCupIconStyle(pos)}/> :
                                    <WorkspacePremiumIcon style={{ color: deepPurple['400'], fontSize: 40 }}/>
                        }
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
    );
}

export default UsersRating;