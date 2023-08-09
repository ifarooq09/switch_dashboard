import { Box, Typography, FormControl, FormHelperText, TextField, Stack, Button } from "@mui/material";

import { BuildingFormProps } from "interfaces/common"
import CustomButton from "./CustomButton"

const Form = ({ type, register, handleSubmit, formLoading, handleImageChange, onFinish, onFinishHandler, buildingImage}: BuildingFormProps) => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a Building
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form style={{
          marginTop: '20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap:'20px'
        }} onSubmit={handleSubmit(onFinishHandler)}>
          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px', fontSize: 16, color: '#11142d'}}>Enter Building Name</FormHelperText>
            <TextField 
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register('buildingName', {
                required: true
              })}
            />
          </FormControl>
          <Stack direction="column" gap={1} justifyContent="center" mb={2}>
            <Stack direction="row" gap={2}>
              <Typography color="#11142d" fontSize={16} fontWeight={500} my="10px">Building Photo</Typography>

              <Button component="label" sx={{
                width: 'fit-content',
                color: "#2ed480",
                textTransform: 'capitalize',
                fontSize: 16
              }}> Upload * <input 
                              hidden
                              accept="image/*"
                              type="file"
                              onChange={(e) => {
                                // @ts-ignore
                                handleImageChange(e.target.files[0])
                              }} />
              </Button>
            </Stack>
              <Typography fontSize={14} color="#808191" sx={{
              wordBreak: 'break-all'
              }}>
              {buildingImage?.name}
              </Typography>
          </Stack>
          <CustomButton 
            type="submit"
            title={formLoading ? `${type}ing...` : `${type}`}
            backgroundColor="#475be8"
            color= "#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  )
}

export default Form