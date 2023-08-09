import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";

import { FloorFormProps } from "interfaces/common";
import CustomButton from "./CustomButton";

// ...

const FloorForm = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinish,
  onFinishHandler,
  onBuildingChange,
  buildingOptions,
  defaultBuildingValue,
  defaultFloorValue
}: FloorFormProps) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>(
    defaultBuildingValue
  );

  const [selectedFloor, setSelectedFloor] = useState<string | undefined> (
    defaultFloorValue
  )

  useEffect(() => {
    // Set the default selectedBuilding when the defaultBuildingValue changes
    setSelectedBuilding(defaultBuildingValue);
  }, [defaultBuildingValue]);

  useEffect(() => {
    // Set the default selectedFloor when the defaultFloorValue changes
    setSelectedFloor(defaultFloorValue);
  }, [defaultFloorValue]);

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    onBuildingChange(value); // Notify the parent component about the building change
  };

  const floorOptions = [
    { value: "Basement", label: "Basement" },
    { value: "First Floor", label: "First Floor" },
    { value: "Second Floor", label: "Second Floor" },
    { value: "Third Floor", label: "Third Floor" },
    { value: "Fourth Floor", label: "Fourth Floor" },
    { value: "Fifth Floor", label: "Fifth Floor" },
    { value: "Sixth Floor", label: "Sixth Floor" },
    { value: "Seventh Floor", label: "Seventh Floor" },
    { value: "Eight Floor", label: "Eight Floor" },
  ];

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
              Select Floor
            </FormHelperText>
            <Select
              fullWidth
              required
              id="floor-number"
              color="info"
              variant="outlined"
              {...register("floorNumber", {
                required: true,
              })}
              value={selectedFloor ?? ""} // Use selectedFloor as the value prop
              onChange={(e) => setSelectedFloor(e.target.value as string)}
            >
              {floorOptions.map((option) => (
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
                margin: "10px",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Select Building
            </FormHelperText>
            <Select
              id="building-select"
              color="info"
              fullWidth
              onChange={(e) => handleBuildingChange(e.target.value)}
              value={selectedBuilding ?? ""}
            >
              {buildingOptions?.map((option) => (
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

export default FloorForm;

