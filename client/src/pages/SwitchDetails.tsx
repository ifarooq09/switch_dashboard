import { Typography, Box, Stack } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ChatBubble, Delete, Edit, Phone } from "@mui/icons-material";

import { CustomButton } from "components";
import { PortCard } from "components";

type UserRole= "admin" | "editor";

interface allPorts {
  _id: string;
  interfaceDetail: string;
  title: string;
  ciscophone: string;
  mac: string;
  switchDetail: {
    title: string;
    ip: string;
  }[];
  floor: {
    floorNumber: string;
  }[];
  building: {
    buildingName: string;
  }[];
}

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const SwitchDetails = () => {
  const navigate = useNavigate();

  const userRole = (JSON.parse(localStorage.getItem("user") || "{}").role || "editor") as UserRole;

  //Define roles and their corresponding permissions
  const rolesPermissions = {
    admin: ["create", "delete", "list", "show", "edit"],
    editor: ["edit", "list", "show"],
  };

  //Get the user's permissions based on their role
  const userPermissions = rolesPermissions[userRole] || []

  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const { queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams();

  const { data, isLoading, isError } = queryResult;

  const switchDetails = data?.data ?? {};

  const allPorts: allPorts[] = switchDetails?.allPorts ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  const isCurrentUser = user.email;

  const handleDeleteSwitch = () => {
    const response = window.confirm(
      "Are you sure you want to delete this Switch?"
    );
    if (response) {
      mutate(
        {
          resource: "switch",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/switch");
          },
        }
      );
    }
  };

  const customSort = (a: any, b: any) => {
    const partsA = a.interfaceDetail.match(/(\d+)/g).map((part: string) => parseInt(part));
    const partsB = b.interfaceDetail.match(/(\d+)/g).map((part: string) => parseInt(part));
  
    for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
      if (partsA[i] !== partsB[i]) {
        return partsA[i] - partsB[i];
      }
    }
  
    return partsA.length - partsB.length;
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
                  Switch Title:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                >
                  {switchDetails.title}
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
                  IP Address:
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  color="#11142D"
                  textTransform="capitalize"
                  mt={5}
                >
                  {switchDetails.ip}
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
                  {switchDetails.floor[0].floorNumber}
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
                  {switchDetails.building[0].buildingName}
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
                      navigate(`/switch/edit/${switchDetails._id}`);
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
                    if (isCurrentUser) handleDeleteSwitch();
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
          Ports
        </Typography>
        {allPorts.length === 0 ? (
          <Typography fontSize={18} fontWeight={400} color="#11142D">
            - There is no Port in this Switch
          </Typography>
        ) : (
          <Box
            mt="20px"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {allPorts
            .sort(customSort)
            .map((port: allPorts) => (
              <PortCard
                key={port._id}
                id={port._id}
                interfaceDetail={port.interfaceDetail}
                title={port.title}
                ciscophone={port.ciscophone}
                mac={port.mac}
                switchtitle={
                  port.switchDetail && port.switchDetail.length > 0
                    ? port.switchDetail[0].title
                    : ""
                }
                switchip={
                  port.switchDetail && port.switchDetail.length > 0
                    ? port.switchDetail[0].ip
                    : ""
                }
                floorNumber={
                  port.floor && port.floor.length > 0
                    ? port.floor[0].floorNumber
                    : ""
                }
                building={
                  port.building && port.building.length > 0
                    ? port.building[0].buildingName
                    : ""
                }
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SwitchDetails;
