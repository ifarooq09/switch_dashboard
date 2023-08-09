import { Link } from "react-router-dom";
import { Typography, Card, CardContent, Stack } from "@mui/material";
import {
  TitleOutlined,
  HttpOutlined,
  StairsOutlined,
  VillaOutlined,
} from "@mui/icons-material";

import { SwitchCardProps } from "interfaces/property";

const SwitchCard = ({
  id,
  title,
  ip,
  floorNumber,
  building,
}: SwitchCardProps) => {
  return (
    <Card
      component={Link}
      to={`/switch/show/${id}`}
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
          <TitleOutlined />
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
          <HttpOutlined />
          <Typography
            sx={{ marginLeft: "20px" }}
            fontSize={16}
            fontWeight={500}
            color="#11142d"
          >
            {ip}
          </Typography>
        </Stack>
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

export default SwitchCard;
