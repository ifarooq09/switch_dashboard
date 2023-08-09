import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import FloorForm from "components/common/FloorForm";

interface Building {
  _id: string;
  buildingName: string;
}

const EditFloor = () => {
  const { id } = useParams(); // Assuming you have the floor ID as a URL parameter
  const navigate = useNavigate();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue, // We need this from react-hook-form to set field values
  } = useForm();
  const [buildingData, setBuildingData] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | undefined>(undefined);


  const [floorData, setFloorData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/floor/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((floorData) => {
        console.log("Floor Data:", floorData);

        // Check if floorData is not null and has the floorNumber property
        if (floorData !== null && floorData.floorNumber && floorData.building) {
          setValue("floorNumber", floorData.floorNumber);

          // Set both floorData and selectedBuilding states together
          setFloorData(floorData);

          // Fetch building data after receiving floor data
          fetch("http://localhost:8080/api/v1/building?_end=10&_start=0&", {
            method: "GET",
          })
            .then((res) => res.json())
            .then((allBuildingData: Building[]) => { // Provide type for allBuildingData
              setBuildingData(allBuildingData);

              // Set the selected building based on the floor data
              const selectedBuilding = allBuildingData.find(
                (b: Building) => b._id === floorData.building[0]?._id // Provide type for b
              );

              console.log("Selected Building Data:", selectedBuilding);

              setSelectedBuilding(selectedBuilding);
            })
            .catch((error) => {
              console.error("Error fetching building data:", error);
            });
        } else {
          console.error("Floor data is null, undefined, or missing 'floorNumber' property");
        }
      })
      .catch((error) => {
        console.error("Error fetching floor data:", error);
      });
  }, [id, setValue]);


  const onFinishHandler = async (data: FieldValues) => {
    if (!selectedBuilding) {
      console.error("No building selected!");
      return;
    }

    const updatedFloorData = {
      ...data,
      building: {
        _id: selectedBuilding._id,
      },
      email: user.email,
    };

    console.log("Updated Floor Data:", updatedFloorData);

    await onFinish(updatedFloorData);
    navigate("/floor", { replace: true });
  };

  return (
    <FloorForm
      type="Edit"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
      buildingOptions={buildingData?.map((building) => ({
        value: building._id, // Assuming 'value' should be the building ID
        label: building.buildingName,
      }))}
      defaultBuildingValue={selectedBuilding?._id ?? ""} // Pass an empty string if selectedBuilding is undefined
      defaultFloorValue={floorData?.floorNumber ?? ""}
      onBuildingChange={(value) => {
        const building = buildingData.find((b) => b._id === value);
        setSelectedBuilding(building);
      }}
    />
  );
};

export default EditFloor;
