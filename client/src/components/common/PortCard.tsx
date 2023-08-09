import { Link } from "react-router-dom";
import { Typography, Card, CardContent, Stack, Box } from "@mui/material";
import {
  VillaOutlined,
  StairsOutlined,
  TitleOutlined,
  HttpOutlined,
  LanOutlined,
  GroupAddOutlined,
  DialerSipOutlined,
  DevicesOutlined,
} from "@mui/icons-material";

import { PortCardProps } from "interfaces/property";

const PortCard = ({
  id,
  interfaceDetail,
  title,
  ciscophone,
  mac,
  switchtitle,
  switchip,
  floorNumber,
  building,
}: PortCardProps) => {
  // Display the MAC Address with dynamic line breaks
  const renderMacAddress = (macAddress: string) => {
    const parts = macAddress.split("-");
    return (
      <>
        {parts.map((part: string, index: number) => (
          <Typography
            key={index}
            fontSize={16}
            fontWeight={500}
            color="#11142D"
            textTransform="capitalize"
            mt={index !== 0 ? 1 : 0}
            sx={{ textAlign: "left" }}
          >
            {part}
          </Typography>
        ))}
      </>
    );
  };

  return (
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
        <Stack
          direction="column"
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <LanOutlined />
          <Typography
            sx={{ marginLeft: "20px" }}
            fontSize={16}
            fontWeight={500}
            color="#11142d"
          >
            {interfaceDetail}
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
            {title}
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
            {ciscophone}
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
            <Box>{renderMacAddress(mac)}</Box>
          </Typography>
        </Stack>
        {switchtitle && (
          <Stack
            direction="column"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <TitleOutlined />
            <Typography
              sx={{ marginLeft: "20px" }}
              fontSize={16}
              fontWeight={500}
              color="#11142d"
            >
              {switchtitle}
            </Typography>
          </Stack>
        )}
        {switchip && (
          <Stack
            direction="column"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <HttpOutlined />
            <Typography
              sx={{ marginLeft: "20px" }}
              fontSize={16}
              fontWeight={500}
              color="#11142d"
            >
              {switchip}
            </Typography>
          </Stack>
        )}
        {floorNumber && (
          <Stack
            direction="column"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <StairsOutlined />
            <Typography
              sx={{ marginLeft: "20px" }}
              fontSize={16}
              fontWeight={500}
              color="#11142d"
            >
              {floorNumber}
            </Typography>
          </Stack>
        )}
        {building && (
          <Stack
            direction="column"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <VillaOutlined />
            <Typography
              sx={{ marginLeft: "20px" }}
              fontSize={16}
              fontWeight={500}
              color="#11142d"
            >
              {building}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default PortCard;
