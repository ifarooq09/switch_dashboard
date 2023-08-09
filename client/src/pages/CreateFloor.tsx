import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

import FloorForm from "components/common/FloorForm";

interface Building {
  _id: string;
  buildingName: string;
}

const CreateFloor = () => {
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
  >(buildingData[0]);

  useEffect(() => {
    fetch("https://switch-dashboard-l646.onrender.com/api/v1/building?_end=10&_start=0&", {
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

  const onFinishHandler = async (data: FieldValues) => {
    if (!selectedBuilding) {
      console.error("No building selected!");
      return;
    }

    const floorData = {
      ...data,
      building: {
        _id: selectedBuilding._id,
      },
      email: user.email,
    };

    // console.log("data to be inserted: " + JSON.stringify(floorData))

    await onFinish(floorData);
    navigate("/floor", { replace: true });
  };

  return (
    <FloorForm
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
      }}
    />
  );
};

export default CreateFloor;
