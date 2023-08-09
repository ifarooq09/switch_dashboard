import { Typography, Box, Stack } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ChatBubble, Delete, Edit, Email, Phone} from "@mui/icons-material";

import { CustomButton } from "components";

type UserRole = "admin" | "editor";

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const UserDetails = () => {
  const navigate = useNavigate();

  const userRole = (JSON.parse(localStorage.getItem("user") || "{}").role ||
    "editor") as UserRole;

  //Define roles and their corresponding permissions
  const rolesPermissions = {
    admin: ["create", "delete", "list", "show", "edit"],
    editor: ["edit", "list", "show"],
  };

  //Get the user's permissions based on their role
  const userPermissions = rolesPermissions[userRole] || [];

  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });
  const { queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams();

  const { data, isLoading, isError } = queryResult;

  const userDetails = data?.data ?? {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  const isCurrentUser = user.email;

  const handleDeletePort = () => {
    const response = window.confirm(
      "Are you sure you want to delete this Port?"
    );
    if (response) {
      mutate(
        {
          resource: "user",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/user");
          },
        }
      );
    }
  };

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        User Details
      </Typography>

      <Box mt="20px" borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
          }}
        >
          <img
            src={
              checkImage(userDetails.avatar)
                ? userDetails.avatar
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            }
            width={340}
            height={320}
            alt="abstract"
            className="my_profile-bg"
          />
          <Box
            flex={1}
            sx={{
              marginTop: { md: "58px" },
              marginLeft: { xs: "20px", md: "0px" },
            }}
          >
            <Box
              flex={1}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap="20px"
            >
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                gap="30px"
              >
                <Stack direction="column">
                  <Typography fontSize={22} fontWeight={600} color="#11142D">
                    {userDetails.name}
                  </Typography>
                  <Typography fontSize={16} color="#808191">
                    {userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}
                  </Typography>
                </Stack>
                <Stack direction="column" gap="30px">
                  <Stack direction="row" flexWrap="wrap" gap="20px" pb={4}>
                    <Stack flex={1} gap="15px">
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="#808191"
                      >
                        Email
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="10px"
                      >
                        <Email sx={{ color: "#11142D" }} />
                        <Typography fontSize={14} color="#11142D">
                          {userDetails.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Box>
            <Stack
              width="100%"
              mt="25px"
              direction="row"
              flexWrap="wrap"
              gap={2}
            >
              <CustomButton
                title={!isCurrentUser ? "Message" : "Edit"}
                backgroundColor="#475BE8"
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <ChatBubble /> : <Edit />}
                handleClick={() => {
                  if (isCurrentUser) {
                    navigate(`/user/edit/${userDetails._id}`);
                  }
                }}
              />
              {userPermissions.includes("delete") ? (
                <CustomButton
                  title={!isCurrentUser ? "Call" : "Delete"}
                  backgroundColor={!isCurrentUser ? "#2ED480" : "#d42e2e"}
                  color="#FCFCFC"
                  fullWidth
                  icon={!isCurrentUser ? <Phone /> : <Delete />}
                  handleClick={() => {
                    if (isCurrentUser) handleDeletePort();
                  }}
                />
              ) : null}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetails;
