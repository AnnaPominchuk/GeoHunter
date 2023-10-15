'use client'

import {useState, useEffect} from 'react'
import User from '@/model/User'

import { 
    Box, 
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead
} from '@mui/material';

import theme from '@/utils/Theme'

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { getDictionary } from '@/lib/dictionary'
import { Props } from '@/utils/Props'

import UserRole from '@/utils/UserRole'

import StarIcon from '@mui/icons-material/Star';

// const StyledTableRow = styled(TableRow)(({ theme }) => ({

// }));

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

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh', flexDirection:'column'}} bgcolor="secondary.main">
          <TableContainer component={Paper} sx={{ width:'90%', mt:'20px' }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
                <TableRow sx={{ height:"50px" }}>
                  <TableCell align="left"> { dictionary ? dictionary.common.name : '' } </TableCell>
                  <TableCell align="left"> { dictionary ? dictionary.rating.rate : '' } </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                    <TableRow
                      key={user.name}
                      sx={{ height:"50px" }}
                    >
                      <TableCell align="left">{`${user.name} ${user.lastname}`}</TableCell>
                      <TableCell align="left" color="inherit" >
                        {user.rating}
                        <StarIcon color="inherit"  />
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