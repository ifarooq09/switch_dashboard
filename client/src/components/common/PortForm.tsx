import { useState } from "react"
import { Box, Typography, FormControl, FormHelperText, TextField, Select, MenuItem } from "@mui/material";

import { PortFormProps } from "interfaces/common"
import CustomButton from "./CustomButton"

const PortForm = ({
    type,
    register,
    handleSubmit,
    formLoading,
    onFinish,
    onFinishHandler,
    onBuildingChange,
    buildingOptions,
    onFloorChange,
    floorOptions,
    onSwitchChange,
    switchOptions,
    onSwitchIPChange,
    switchIPOption
  }: PortFormProps) => {
    const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(null);
    const [selectedFloorIndex, setSelectedFloorIndex] = useState<number | null>(null);
    const [selectedSwitchIndex, setSelectedSwitchIndex] = useState<number | null>(null);
    const [selectedSwitchIPIndex, setSelectedSwitchIPIndex] = useState<number | null>(null);
  
    const handleBuildingChange = (value: string) => {
      const index = buildingOptions?.findIndex((option) => option.value === value);
      setSelectedBuildingIndex(index !== -1 && index !== undefined ? index : null);
      onBuildingChange(value);
    };
  
    const handleFloorChange = (value: string) => {
      const index = floorOptions?.findIndex((option) => option.value === value);
      setSelectedFloorIndex(index !== -1 && index !== undefined ? index : null);
      onFloorChange(value);
    };

    const handleSwitchChange = (value: string) => {
        const index = switchOptions?.findIndex((option) => option.value === value);
        setSelectedSwitchIndex(index !== -1 && index !== undefined ? index : null);
        onSwitchChange(value);
      };
    
      const handleSwitchIPChange = (value: string) => {
        const index = switchIPOption?.findIndex((option) => option.value === value);
        setSelectedSwitchIPIndex(index !== -1 && index !== undefined ? index : null);
        onSwitchIPChange(value);
      };
  
    const selectedBuilding = buildingOptions?.[selectedBuildingIndex ?? 0];
    const selectedFloor = floorOptions?.[selectedFloorIndex ?? 0];
    const selectedSwitch = switchOptions?.[selectedSwitchIndex ?? 0];
    const selectedSwitchIP = switchIPOption?.[selectedSwitchIPIndex ?? 0];
  
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
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d',
                }}
              >
                Select Building
              </FormHelperText>
              <Select
                id="building-select"
                color="info"
                fullWidth
                onChange={(e) => handleBuildingChange(e.target.value)}
                value={selectedBuilding?.value ?? ''}
              >
                {buildingOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d',
                }}
              >
                Select Floor
              </FormHelperText>
              <Select
                id="floor-select"
                color="info"
                fullWidth
                onChange={(e) => handleFloorChange(e.target.value)}
                value={selectedFloor?.value ?? ''}
              >
                {floorOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d',
                }}
              >
                Select Switch
              </FormHelperText>
              <Select
                id="switch-select"
                color="info"
                fullWidth
                onChange={(e) => handleSwitchChange(e.target.value)}
                value={selectedSwitch?.value ?? ''}
              >
                {switchOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d',
                }}
              >
                Select Switch IP
              </FormHelperText>
              <Select
                id="switch-ip-select"
                color="info"
                fullWidth
                onChange={(e) => handleSwitchIPChange(e.target.value)}
                value={selectedSwitchIP?.value ?? ''}
              >
                {switchIPOption?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
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

export default PortForm
