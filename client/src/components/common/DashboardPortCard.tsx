import { Link } from "react-router-dom";
import { Typography, Card, CardContent, Stack } from "@mui/material";
import {
  ShareOutlined,
  GroupAddOutlined,
  DialerSipOutlined,
  DevicesOutlined,
} from "@mui/icons-material";

import { DashboardPortCardProps } from "interfaces/property";

const DashboardPortCard = ({
  id,
  interfaceDetail,
  title,
  ciscophone,
  mac,
}: DashboardPortCardProps) => {
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
          <ShareOutlined />
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
            {mac}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardPortCard;
