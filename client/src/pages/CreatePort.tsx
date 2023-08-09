import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import PortForm from "components/common/PortForm";

interface Building {
  _id: string;
  buildingName: string;
}

interface Floor {
  _id: string;
  floorNumber: string;
  buildingId: string;
}

interface Switch {
  _id: string;
  title: string;
  ip: string;
  floorId: string;
}

const CreatePort = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const [buildingData, setBuildingData] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<
    Building | undefined
  >(undefined);

  const [floorData, setFloorData] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | undefined>(
    undefined
  );

  const [filteredFloorData, setFilteredFloorData] = useState<Floor[]>([]);
  const [floorOptions, setFloorOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [switchData, setSwitchData] = useState<Switch[] | null>(null);
  const [selectedSwitchId, setSelectedSwitchId] = useState<string>("");
  const [selectedSwitchIP, setSelectedSwitchIP] = useState<Switch | undefined>(
    undefined
  );

  const [loadingSwitches, setLoadingSwitches] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/building?_end=10&_start=0&", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((allBuildingData) => {
        setBuildingData(allBuildingData);

        if (!selectedBuilding && allBuildingData.length > 0) {
          setSelectedBuilding(allBuildingData[0]);
        }
      });
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding) {
      fetch(`http://localhost:8080/api/v1/building/${selectedBuilding._id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((buildingData) => {
          const allFloorData = buildingData.allFloors;
          setFloorData(allFloorData);

          if (!selectedFloor && allFloorData.length > 0) {
            setSelectedFloor(allFloorData[0]);
          }
        });
    }
  }, [selectedBuilding, selectedFloor]);

  useEffect(() => {
    if (selectedFloor) {
      fetch(`http://localhost:8080/api/v1/floor/${selectedFloor._id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((switchData) => {
          const allSwitchData = switchData.allSwitches;
          setSwitchData(allSwitchData);
          setLoadingSwitches(false);

          if (allSwitchData.length > 0) {
            const previouslySelectedSwitch = allSwitchData.find(
              (sw: Switch) => sw._id === selectedSwitchId
            );
            setSelectedSwitchId(
              previouslySelectedSwitch
                ? previouslySelectedSwitch._id
                : allSwitchData[0]._id
            );
          }
        })
        .catch((error) => {
          console.error("Failed to fetch switch data:", error);
          setLoadingSwitches(false);
        });
    } else {
      setSwitchData([]); // Reset switchData if no floor is selected
    }
  }, [selectedFloor, selectedSwitchId]);

  useEffect(() => {
    const options = floorData.map((floor) => ({
      value: floor._id,
      label: floor.floorNumber,
    }));

    setFloorOptions(options);
  }, [floorData]);

  const onFinishHandler = async (data: FieldValues) => {
    if (!selectedBuilding) {
      console.error("No building selected!");
      return;
    }

    if (!selectedFloor) {
      console.error("No Floor selected!");
      return;
    }

    const switchDetail = switchData?.find(
      (sw: Switch) => sw._id === selectedSwitchId
    );

    if (!switchDetail) {
      console.error("No Switch selected!");
      return;
    }

    const SwitchData = {
      ...data,
      building: {
        _id: selectedBuilding._id,
      },
      floor: {
        _id: selectedFloor._id,
      },
      switchDetail,
      email: user?.email,
    };

    await onFinish(SwitchData);
    navigate("/port", { replace: true });
  };

  return (
    <PortForm
      type="Add"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
      buildingOptions={buildingData?.map((building) => ({
        value: building._id,
        label: building.buildingName,
      }))}
      onBuildingChange={(value) => {
        const building = buildingData.find((b) => b._id === value);
        setSelectedBuilding(building);

        const filteredFloors = floorData.filter((floor) => {
          return floor.buildingId === value;
        });
        setFilteredFloorData([...filteredFloors]);

        // If selected floor is not in filtered floors, reset to first floor
        if (!filteredFloors.some((floor) => floor._id === selectedFloor?._id)) {
          setSelectedFloor(filteredFloors[0]);
        }
      }}
      floorOptions={floorOptions}
      onFloorChange={(value) => {
        const floor = floorData.find((f) => f._id === value);
        setSelectedFloor(floor);
        setSelectedSwitchId(""); // Reset selected switch ID when floor changes
      }}
      switchOptions={
        loadingSwitches
          ? []
          : (switchData || []).map((sw) => ({
              value: sw._id,
              label: sw.title,
            }))
      }
      onSwitchChange={(value) => {
        setSelectedSwitchId(value);
      }}
      switchIPOption={
        loadingSwitches
          ? []
          : (switchData || []).map((sw) => ({
              value: sw._id,
              label: sw.ip,
            }))
      }
      onSwitchIPChange={(value) => {
        const selectedSwitchIP = switchData?.find((sw) => sw.ip === value);
        setSelectedSwitchIP(selectedSwitchIP || undefined);
      }}
    />
  );
};

export default CreatePort;
