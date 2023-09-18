import { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BuildingCard } from "components";

interface Building {
  _id: string;
  buildingName: string;
  photo: string;
  // Add other properties as needed
}

// interface Floor {
//   _id: string;
//   floorNumber: string;
//   building: Building[];
//   // Add other properties as needed
// }

// interface Switch {
//   _id: string;
//   title: string;
//   ip: string;
//   floor: Floor[];
//   building: Building[];
//   // Add other properties as needed
// }

// interface Port {
//   _id: string;
//   interfaceDetail: string;
//   title: string;
//   ciscophone: string;
//   mac: string;
//   switchDetail: Switch[];
//   floor: Floor[];
//   building: Building[];
//   // Add other properties as needed
// }

const Dashboard = () => {
  const navigate = useNavigate();

  const [buildingData, setBuildingData] = useState<Building[]>([]);

  // const [portData, setPortData] = useState<Port[]>([]);

  // Fetch building data from the backend
  useEffect(() => {
    fetch("https://switch-dashboard-l646.onrender.com/api/v1/building?_end=16&_start=0&")
      .then((res) => res.json())
      .then((data) => {
        setBuildingData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch building data:", error);
      });

    // fetch("http://localhost:8080/api/v1/port?_end=4&_start=0&")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setPortData(data);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch floor data:", error);
    //   });
  }, []);

  return (
    <div>
      {/* General Search Button (Top Right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
          marginRight: "16px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/search")}
          style={{
            backgroundColor: "#475be8",
            color: "#fff",
          }}
        >
          General Search
        </Button>
      </div>

      {/* Building Icons and Names */}
      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          All Buildings
        </Typography>

        {buildingData.length > 0 ? (
          <Box
          mt={2.5}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          
          {buildingData.map((building: any) => (
            <BuildingCard
              key={building._id}
              id={building._id}
              buildingName={building.buildingName}
              photo={building.photo}
            />
          ))}
        </Box>
        ) : "There is no data in All Building"}
        
        {/* Centered Typography and Button */}
        <Box mt={2.5} display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/building")}
            style={{
              marginTop: "8px",
              borderColor: "#475be8",
              color: "#475be8",
            }}
          >
            Go to All Building
          </Button>
        </Box>
      </Box>

      {/* Port Icons and Names */}
      {/* <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          All Ports
        </Typography>

        {portData.length > 0 ? (
          <Box
          mt={2.5}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {portData.map((ports: any) => (
            <PortCard
              key={ports._id}
              id={ports._id}
              interfaceDetail={ports.interfaceDetail}
              title={ports.title}
              ciscophone={ports.ciscophone}
              mac={ports.mac}
              switchtitle={ports.switchDetail[0]?.title ?? ""}
              switchip={ports.switchDetail[0]?.ip ?? ""}
              floorNumber={ports.floor[0]?.floorNumber ?? ""}
              building={ports.building[0]?.buildingName ?? ""}
            />
          ))}
        </Box>
        ) :  "There is no data in All Ports"}
    
        {/* Centered Typography and Button */}
        {/* <Box mt={2.5} display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/floor")}
            style={{
              marginTop: "8px",
              borderColor: "#475be8",
              color: "#475be8",
            }}
          >
            Go to All Ports
          </Button>
        </Box>
      </Box> */} 
    </div>
  );
};

export default Dashboard;
