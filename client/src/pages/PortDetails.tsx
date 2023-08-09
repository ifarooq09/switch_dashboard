import { Typography, Box, Stack, Card, CardContent } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ChatBubble, Delete, Edit, Phone } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShareOutlined,
  GroupAddOutlined,
  DialerSipOutlined,
  DevicesOutlined,
  UpgradeOutlined,
} from "@mui/icons-material";

import { CustomButton } from "components";

type UserRole = "admin" | "editor";

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

interface PortData {
  _id: string;
  portId: string;
  previousData: {
    interfaceDetail: string;
    title: string;
    ciscophone: string;
    mac: string;
  };
  createdAt: string;
}

const fetchPortDataFromDatabase = (userId: any) => {
  return fetch(`https://switch-dashboard-l646.onrender.com/api/v1/log/${userId}`)
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

const PortDetails = () => {
  const navigate = useNavigate();

  const userRole = (JSON.parse(localStorage.getItem("user") || "{}").role ||
    "editor") as UserRole;

  //Define roles and their corresponding permissions
  const rolesPermissions = {
    admin: ["create", "delete", "list", "show", "edit"],
    editor: ["edit", "list", "show"],
  };

  const [previousDetails, setPreviousDetails] = useState<PortData[]>([]);

  //Get the user's permissions based on their role
  const userPermissions = rolesPermissions[userRole] || [];

  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });
  const { queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams();

  const { data, isLoading, isError } = queryResult;

  const portDetails = data?.data ?? {};

  useEffect(() => {
    if (id) {
      // Fetch the latest user data from the database using an API call
      fetchPortDataFromDatabase(id)
        .then((userDetails) => {
          setPreviousDetails(userDetails);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setPreviousDetails([]);
        });
    }
  }, [id]);

  // const createdAt = previousDetails[0]?.createdAt;

  // console.log(createdAt);

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
          resource: "port",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/port");
          },
        }
      );
    }
  };

  // Display the MAC Address with dynamic line breaks
  const renderMacAddress = (macAddress: string) => {
    const parts = macAddress.split("-");
    return (
      <>
        {parts.map((part: string, index: number) => (
          <Typography
            key={index}
            fontSize={18}
            fontWeight={500}
            color="#11142D"
            textTransform="capitalize"
            mt={index !== 0 ? 2 : 0}
            sx={{ textAlign: "right" }}
          >
            {part}
          </Typography>
        ))}
      </>
    );
  };

  return (
    <>
      <Box borderRadius="15px" padding="20px" bgcolor="#FCFCFC" width="100%">
        <Typography fontSize={25} fontWeight={700} color="#11142D">
          Details
        </Typography>

        <Box
          mt="20px"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          gap={4}
        >
          <Box flex={1} maxWidth={764}>
            <Box mt="15px">
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography fontSize={20} fontWeight={700} color="#11142D">
                  Interface Title:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                >
                  {portDetails.interfaceDetail}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  Client Name:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {portDetails.title}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  CISCO Number:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                  mb={2}
                >
                  {portDetails.ciscophone}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  MAC Address:
                </Typography>
                <Box>{renderMacAddress(portDetails.mac)}</Box>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  Switch Name:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {portDetails.switchDetail[0].title}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  Switch IP Address:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {portDetails.switchDetail[0].ip}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  Floor Number:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {portDetails.floor[0].floorNumber}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
              >
                <Typography
                  fontSize={20}
                  fontWeight={700}
                  color="#11142D"
                  mt={5}
                >
                  Building Name:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {portDetails.building[0].buildingName}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Box
            width="100%"
            flex={1}
            maxWidth={326}
            display="flex"
            flexDirection="column"
            gap="20px"
          >
            <Stack
              width="100%"
              p={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              border="1px solid #E4E4E4"
              borderRadius={2}
            >
              <Stack
                mt={2}
                justifyContent="center"
                alignItems="center"
                textAlign="center"
              >
                <img
                  src={
                    checkImage(user.avatar)
                      ? user.avatar
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                  }
                  alt="avatar"
                  width={90}
                  height={90}
                  style={{
                    borderRadius: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box mt="15px">
                  <Typography fontSize={18} fontWeight={600} color="#11142D">
                    {user.name}
                  </Typography>
                  <Typography
                    mt="5px"
                    fontSize={14}
                    fontWeight={400}
                    color="#808191"
                  >
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Typography>
                </Box>
              </Stack>

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
                      navigate(`/port/edit/${portDetails._id}`);
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
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box marginTop={3}>
        <Typography fontSize={25} fontWeight={700} color="#11142D">
          Previous Details
        </Typography>
        <Box
          mt="20px"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {previousDetails.map((previousData, index) => (
            <Card
              component={Link}
              to={`/port/show/${id}`}
              sx={{
                maxWidth: "330px",
                padding: "10px",
                "&:hover": {
                  boxShadow: "0 22px 25px 2px rgba(176, 176, 176, 0.1)",
                },
                cursor: "pointer",
              }}
              elevation={0}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingX: "5px",
                }}
              >
                <Typography
                  sx={{ marginLeft: "5px", marginRight: "10px", marginBottom: "20px" }}
                  fontSize={16}
                  fontWeight={500}
                  color="#11142d"
                >
                  {"Update No: "}{index + 1}
                  {/* Add the index + 1 as the numbering starts from 1 */}
                </Typography>
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <ShareOutlined />
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    fontSize={16}
                    fontWeight={500}
                    color="#11142d"
                  >
                    {previousData.previousData.interfaceDetail}
                  </Typography>
                </Stack>
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <GroupAddOutlined />
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    fontSize={16}
                    fontWeight={500}
                    color="#11142d"
                  >
                    {previousData.previousData.title}
                  </Typography>
                </Stack>
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <DialerSipOutlined />
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    fontSize={16}
                    fontWeight={500}
                    color="#11142d"
                  >
                    {previousData.previousData.ciscophone}
                  </Typography>
                </Stack>
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <DevicesOutlined />
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    fontSize={16}
                    fontWeight={500}
                    color="#11142d"
                  >
                    {previousData.previousData.mac}
                  </Typography>
                </Stack>
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <UpgradeOutlined />
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    fontSize={16}
                    fontWeight={500}
                    color="#11142d"
                  >
                    {previousData.createdAt.split("T")[0]}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default PortDetails;
