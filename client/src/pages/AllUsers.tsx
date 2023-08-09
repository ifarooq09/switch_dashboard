import { useList } from '@refinedev/core'
import {
  Box,
  Typography,
  Stack
} from "@mui/material";
import UserCard from "components/common/UserCard";
import { CustomButton } from 'components';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';

type UserRole = "admin" | "editor";

const AllUsers = () => {
  const navigate = useNavigate();

  const userRole = (JSON.parse(localStorage.getItem("user") || "{}").role || "editor") as UserRole;

  //Define roles and their corresponding permissions
  const rolesPermissions = {
    admin: ["create", "delete", "list", "show", "edit"],
    editor: ["edit", "list", "show"],
  };

  //Get the user's permissions based on their role
  const userPermissions = rolesPermissions[userRole] || []

  const { data, isLoading, isError } = useList({
    resource: 'user',
  })

  const allUsers = data?.data ?? [];

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error...</div>

    // Filter users based on role
    let filteredUsers = allUsers;
    if (userRole === "editor") {
      const loggedInUserId = (JSON.parse(localStorage.getItem("user") || "{}")._id || "");
      filteredUsers = allUsers.filter((user: any) => user._id === loggedInUserId);
      navigate("/my-profile");
    }

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">Users List</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginTop={3}>
      {userPermissions.includes("create") ? (
        <CustomButton
          title="Add User"
          handleClick={() => navigate("/user/create")}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
      ) : null}
      </Stack>
      <Box
        mt="20px"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          backgroundColor: '#fcfcfc'
        }}
      >
        {filteredUsers.map((user: any) => (
          <UserCard
            key={user._id}
            id={user._id}
            name={user.name}
            email={user.email}
            role={user.role}
            avatar={user?.avatar}
          />
        ))}
      </Box>
    </Box>
  )
}

export default AllUsers
