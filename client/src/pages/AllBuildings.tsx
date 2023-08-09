import { Add } from "@mui/icons-material";
import { useTable, } from "@refinedev/core";
import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { BuildingCard, CustomButton } from "components";
import { useMemo } from "react";

type UserRole = "admin" | "editor";

const AllBuildings = () => {
  const navigate = useNavigate();

  const userRole = (JSON.parse(localStorage.getItem("user") || "{}").role || "editor") as UserRole;

  //Define roles and their corresponding permissions
  const rolesPermissions = {
    admin: ["create", "delete", "list", "show", "edit"],
    editor: ["edit", "list", "show"],
  };

  //Get the user's permissions based on their role
  const userPermissions = rolesPermissions[userRole] || []

  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    filters,
    setFilters,
  } = useTable();

  const allBuilding = data?.data ?? [];

  // console.log(allBuilding)

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item: any) =>
      "field" in item ? item : []
    );
    return {
      buildingName:
        logicalFilters.find((item: any) => item.field === "buildingName")?.value ||
        "",
    };
  }, [filters]);

  //  console.log(currentFilterValues)

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error...</Typography>;

  return (
    <Box>
      <Box
        mt="20px"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {!allBuilding.length ? "There are no Building" : "All Buildings"}
          </Typography>

          <Box
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search by Building Name"
                value={currentFilterValues.buildingName}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "buildingName",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {userPermissions.includes("create") ? (
          <CustomButton
          title="Add Building"
          handleClick={() => navigate("/building/create")}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
        ) : null}
      </Stack>
      <Box
        mt="20px"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {allBuilding.map((building: any) => (
          <BuildingCard
            key={building._id}
            id={building._id}
            buildingName={building.buildingName}
            photo={building.photo}
          />
        ))}
      </Box>

      {allBuilding.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev: any) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev: any) => prev + 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={10}
            onChange={(e) =>
              setPageSize(e.target.value ? Number(e.target.value) : 10)
            }
          >
            {" "}
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default AllBuildings;
