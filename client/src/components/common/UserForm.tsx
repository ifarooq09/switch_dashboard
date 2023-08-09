import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { UserFormProps } from "interfaces/common";
import CustomButton from "./CustomButton";

const UserForm = ({
  type,
  register,
  onFinish,
  onFinishHandler,
  formLoading,
  handleSubmit,
  handleImageChange,
  userImage,
  role
}: UserFormProps) => {
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
  ];

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} Profile
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Username
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="username"
              color="info"
              variant="outlined"
              {...register("name", {
                required: true,
              })}
            />
          </FormControl>
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Email
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="email"
              color="info"
              variant="outlined"
              {...register("email", {
                required: true,
              })}
            />
          </FormControl>
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Password
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="password"
              color="info"
              variant="outlined"
              {...register("password", {
                required: true,
              })}
              type="password"
            />
          </FormControl>

          {role === "admin" ? (
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Role
              </FormHelperText>
              <Typography
                fontSize={25}
                fontWeight={700}
                color="#11142d"
                marginLeft={1.5}
              >
                Admin
              </Typography>
            </FormControl>
          ) : (
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Role
              </FormHelperText>
              <Select
                fullWidth
                required
                id="floor-number"
                color="info"
                variant="outlined"
                {...register("role", {
                  required: true,
                })}
                defaultValue=" "
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Stack direction="column" gap={1} justifyContent="center" mb={2}>
            <Stack direction="row" gap={2}>
              <Typography
                color="#11142d"
                fontSize={16}
                fontWeight={500}
                my="10px"
              >
                User Photo
              </Typography>

              <Button
                component="label"
                sx={{
                  width: "fit-content",
                  color: "#2ed480",
                  textTransform: "capitalize",
                  fontSize: 16,
                }}
              >
                {" "}
                Upload{" "}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    // @ts-ignore
                    handleImageChange(e.target.files[0]);
                  }}
                />
              </Button>
            </Stack>
            <Typography
              fontSize={14}
              color="#808191"
              sx={{
                wordBreak: "break-all",
              }}
            >
              {userImage?.name}
            </Typography>
          </Stack>
          <CustomButton
            type="submit"
            title={formLoading ? `${type}ing...` : `${type}`}
            backgroundColor="#475be8"
            color="#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  );
};

export default UserForm;
