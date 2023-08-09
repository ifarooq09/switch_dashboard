import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import SwitchForm from "components/common/SwitchForm";

interface Building {
  _id: string;
  buildingName: string;
}

interface Floor {
  _id: string;
  floorNumber: string;
  buildingId: string;
}

const CreateSwitch = () => {
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

  useEffect(() => {
    fetch("https://switch-dashboard-l646.onrender.com/api/v1/building?_end=10&_start=0&", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((allBuildingData) => {
        // console.log(allBuildingData)
        setBuildingData(allBuildingData);

        if (!selectedBuilding && allBuildingData.length > 0) {
          setSelectedBuilding(allBuildingData[0]);
        }
      });
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding) {
      fetch(`https://switch-dashboard-l646.onrender.com/api/v1/building/${selectedBuilding._id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((buildingData) => {
          const allFloorData = buildingData.allFloors;
          console.log(allFloorData);
          setFloorData(allFloorData);

          if (!selectedFloor && allFloorData.length > 0) {
            setSelectedFloor(allFloorData[0]);
          }
        });
    }
  }, [selectedBuilding, selectedFloor]);

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

    const SwitchData = {
      ...data,
      building: {
        _id: selectedBuilding._id,
      },
      floor: {
        _id: selectedFloor._id,
      },
      email: user.email,
    };

    await onFinish(SwitchData);
    navigate("/switch", { replace: true });
  };

  return (
    <SwitchForm
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
      }}
    />
  );
};

export default CreateSwitch;
