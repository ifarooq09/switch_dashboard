import { Box, Typography, FormControl, FormHelperText, TextField } from "@mui/material";

import { EditPortFormProps } from "interfaces/common"
import CustomButton from "./CustomButton"

const EditPortForm = ({
    type,
    register,
    handleSubmit,
    formLoading,
    onFinish,
    onFinishHandler,
    selectedBuilding,
    selectedFloor,
    selectedSwitch,
    selectedSwitchIP
  }: EditPortFormProps) => {
  
    return (
      <Box>
        <Typography fontSize={25} fontWeight={700} color="#11142d">
          {type} a Port
        </Typography>
  
        <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
          <form
            style={{
              marginTop: '20px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onSubmit={handleSubmit(onFinishHandler)}
          >
            <FormControl>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px', fontSize: 16, color: '#11142d' }}>
                Enter Interface Name
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register('interfaceDetail', {
                  required: true,
                })}
              />
            </FormControl>
            <FormControl>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px', fontSize: 16, color: '#11142d' }}>
                Enter Name
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register('title', {
                  required: true,
                })}
              />
            </FormControl>
            <FormControl>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px', fontSize: 16, color: '#11142d' }}>
                Enter Cisco Phone
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register('ciscophone', {
                  required: true,
                })}
              />
            </FormControl>
            <FormControl>
              <FormHelperText sx={{ fontWeight: 500, margin: '10px', fontSize: 16, color: '#11142d' }}>
                Enter MAC Address
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register('mac', {
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
              Switch IP
            </FormHelperText>
            <Typography
              fontSize={14}
              fontWeight={700}
              color="#11142d"
              margin="10px"
            >
              {selectedSwitchIP}
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
              Switch Name
            </FormHelperText>
            <Typography
              fontSize={14}
              fontWeight={700}
              color="#11142d"
              margin="10px"
            >
              {selectedSwitch}
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

export default EditPortForm
