import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";


interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const fetchUserDataFromDatabase = (userId: any) => {
  return fetch(`http://localhost:8080/api/v1/user/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
};

export const Header: React.FC = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const shouldRenderHeader = true; // since we are using the dark/light toggle; we don't need to check if user is logged in or not.

  //console.log(user)

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user && user._id) {
      // Fetch the latest user data from the database using an API call
      fetchUserDataFromDatabase(user._id)
        .then((userData) => {
          setUserData(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
        });
    }
  }, [user]);

  return shouldRenderHeader ? (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{
        background: "#fcfcfc",
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">
            Switch Management Information System
          </Typography>
        </Stack>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          {/* <IconButton
          onClick={() => {
            setMode();
          }}
        >
          {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton> */}
          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
            justifyContent="center"
          >
            {user?.name ? (
                <Typography variant="subtitle2">{userData?.name}</Typography>
            ) : null}
            {user?.avatar ? (
              <Avatar src={userData?.avatar} alt={userData?.name} />
            ) : null}
          </Stack>
        </Stack>
      </Toolbar>
      
    </AppBar>
  ) : null;
};
