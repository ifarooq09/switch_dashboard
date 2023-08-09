import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";

import { EditSwitchFormProps } from "interfaces/common";
import CustomButton from "./CustomButton";

const EditSwitchForm = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinish,
  onFinishHandler,
  selectedBuilding,
  selectedFloor,
}: EditSwitchFormProps) => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a Floor
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
              Enter Switch Name
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("title", {
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
              Enter IP
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("ip", {
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
              Building
            </FormHelperText>
            <Typography
              fontSize={14}
              fontWeight={700}
              color="#11142d"
              margin="10px"
            >
              {selectedBuilding?.[0]?.buildingName}
            </Typography>
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
              Floor
            </FormHelperText>
            <Typography
              fontSize={14}
              fontWeight={700}
              color="#11142d"
              margin="10px"
            >
              {selectedFloor?.[0]?.floorNumber}
            </Typography>
          </FormControl>
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

export default EditSwitchForm;
