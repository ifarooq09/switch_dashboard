import { useNavigate } from "react-router-dom";
import Email from "@mui/icons-material/Email";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomButton from "./CustomButton";
import { ChatBubble, Edit } from "@mui/icons-material";

import { ProfileProps } from "interfaces/common";

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const Profile = ({ id, type, name, role, avatar, email }: ProfileProps) => {

  const navigate = useNavigate()

  const isCurrentUser = id;
  const status = role;

  return (
    <Box>
    <Typography fontSize={25} fontWeight={700} color="#11142D">
      {type} Profile
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
            checkImage(avatar)
              ? avatar
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
                  {name}
                </Typography>
                <Typography fontSize={16} color="#808191">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Typography>
              </Stack>
              <Stack direction="column" gap="30px">
                <Stack direction="row" flexWrap="wrap" gap="20px" pb={4}>
                  <Stack flex={1} gap="15px">
                    <Typography fontSize={14} fontWeight={500} color="#808191">
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
                        {email}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <CustomButton
                  title={!isCurrentUser ? "Message" : "Edit My Profile"}
                  backgroundColor="#475BE8"
                  color="#FCFCFC"
                  fullWidth
                  icon={!isCurrentUser ? <ChatBubble /> : <Edit />}
                  handleClick={() => {
                    if (isCurrentUser && status === "admin") {
                      navigate(`/user/edit/${id}`);
                    } else {
                      navigate(`/my-profile/edit/${id}`)
                    }
                  }}
          />
        </Box>
      </Box>
    </Box>
  </Box>
)
}
export default Profile;
