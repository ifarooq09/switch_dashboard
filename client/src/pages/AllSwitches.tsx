import { Add } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { SwitchCard, CustomButton } from "components";
import { useMemo } from "react";

type UserRole = "admin" | "editor";

const AllSwitches = () => {
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

  const allSwitches = data?.data ?? [];

  // console.log(allSwitches)

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item: any) =>
      "field" in item ? item : []
    );
    return {
      title: logicalFilters.find((item: any) => item.field === "title")?.value || "",
      ip: logicalFilters.find((item: any) => item.field === "ip")?.value || "",
    };
  }, [filters]);

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
            {!allSwitches.length ? "There are no Switches" : "All Switches"}
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
                placeholder="Search by Switch or IP"
                value={currentFilterValues.title || currentFilterValues.ip}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                    {
                      field: "ip",
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
          title="Add Switch"
          handleClick={() => navigate("/switch/create")}
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
        {allSwitches.map((switchs: any) => (
          <SwitchCard
            key={switchs._id}
            id={switchs._id}
            title={switchs.title}
            ip={switchs.ip}
            floorNumber={switchs.floor[0].floorNumber}
            building={switchs.building[0].buildingName}
          />
        ))}
      </Box>

      {allSwitches.length > 0 && (
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

export default AllSwitches;
