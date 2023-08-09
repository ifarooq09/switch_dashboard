import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { BuildingCard, FloorCard, SwitchCard, PortCard } from "components";

interface Building {
  _id: string;
  buildingName: string;
  photo: string;
  // Add other properties as needed
}

interface Floor {
  _id: string;
  floorNumber: string;
  building: Building[];
  // Add other properties as needed
}

interface Switch {
  _id: string;
  title: string;
  ip: string;
  floor: Floor[];
  building: Building[];
  // Add other properties as needed
}

interface Port {
  _id: string;
  interfaceDetail: string;
  title: string;
  ciscophone: string;
  mac: string;
  switchDetail: Switch[];
  floor: Floor[];
  building: Building[];
  // Add other properties as needed
}

type SearchResult = Building | Floor | Switch | Port;

const isBuilding = (result: SearchResult): result is Building => {
  return "buildingName" in result;
};

const isFloor = (result: SearchResult): result is Floor => {
  return "floorNumber" in result;
};

const isSwitch = (result: SearchResult): result is Switch => {
  return "title" in result && !("interfaceDetail" in result);
};

const isPort = (result: SearchResult): result is Port => {
  return "interfaceDetail" in result;
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for each model and assign to the corresponding variables
        const buildingData = await fetch(
          "https://switch-dashboard-l646.onrender.com/api/v1/building?_end=10&_start=0&"
        );
        const floorData = await fetch(
          "https://switch-dashboard-l646.onrender.com/api/v1/floor?_end=10&_start=0&"
        );
        const switchData = await fetch(
          "https://switch-dashboard-l646.onrender.com/api/v1/switch?_end=10&_start=0&"
        );
        const portData = await fetch(
          "https://switch-dashboard-l646.onrender.com/api/v1/port?_end=10&_start=0&"
        );

        const [buildingResults, floorResults, switchResults, portResults] =
          await Promise.all([
            buildingData.json(),
            floorData.json(),
            switchData.json(),
            portData.json(),
          ]);

        // Combine and filter the data based on your matching criteria
        const allData = [
          ...buildingResults,
          ...floorResults,
          ...switchResults,
          ...portResults,
        ];
        const matchedData = allData.filter((item) => {
          return (
            ("buildingName" in item &&
              item.buildingName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            ("floorNumber" in item &&
              item.floorNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            ("title" in item &&
              item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ("ip" in item &&
              item.ip.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ("title" in item &&
              item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ("mac" in item &&
              item.mac.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        });

        setSearchResults(matchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (searchQuery) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      mb={{ xs: "20px", sm: 0 }}
      sx={{
        width: "100%", // Set the width to 100%
      }}
    >
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        General Search
      </Typography>
      <TextField
        variant="outlined"
        color="info"
        placeholder="Search by Building Name, Floor Number, Switch Name, Switch IP, Port User name and Mac Address"
        fullWidth
        InputProps={{
          style: {
            color: "#1b1818",
          },
        }}
        value={searchQuery}
        onChange={handleSearch}
      />
      {searchQuery && searchResults.length > 0
        ? searchResults.map((result: SearchResult, index) => (
            <div key={index}>
              {/* Use the appropriate card component based on the result type */}
              {isBuilding(result) && (
                <Box
                  mt="20px"
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  <BuildingCard
                    id={result._id}
                    buildingName={result.buildingName}
                    photo={result.photo}
                  />
                </Box>
              )}
              {isFloor(result) && (
                <Box
                mt="20px"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <FloorCard
                  id={result._id}
                  floorNumber={result.floorNumber}
                  building={result.building[0]?.buildingName ?? ""}
                />
                </Box>
              )}
              {isSwitch(result) && (
                <Box
                mt="20px"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <SwitchCard
                  id={result._id}
                  title={result.title}
                  ip={result.ip}
                  floorNumber={result.floor[0]?.floorNumber ?? ""}
                  building={result.building[0]?.buildingName ?? ""}
                />
                </Box>
              )}
              {isPort(result) && (
                <Box
                mt="20px"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <PortCard
                  id={result._id}
                  interfaceDetail={result.interfaceDetail}
                  title={result.title}
                  ciscophone={result.ciscophone}
                  mac={result.mac}
                  switchtitle={result.switchDetail[0]?.title ?? ""}
                  switchip={result.switchDetail[0]?.ip ?? ""}
                  floorNumber={result.floor[0]?.floorNumber ?? ""}
                  building={result.building[0]?.buildingName ?? ""}
                />
                </Box>
              )}
            </div>
          ))
        : searchQuery && (
            <Typography variant="body1">No matched data available.</Typography>
          )}
    </Box>
  );
};

export default Search;
