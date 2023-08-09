import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import EditSwitchForm from "components/common/EditSwitchForm";

interface Building {
  _id: string;
  buildingName: string;
}

interface Floor {
  _id: string;
  floorNumber: string;
  buildingId: string;
}

interface SwitchAllData {
  _id: string;
  title: string;
  ip: string;
  floor: Floor[];
  building: Building[];
}

const fetchSwitchDataFromDatabase = (switchId: any) => {
  return fetch(`http://localhost:8080/api/v1/switch/${switchId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
};

const EditSwitch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const [switchDetails, setSwitchDetails] = useState<SwitchAllData | null>(
    null
  );

  useEffect(() => {
    if (id) {
      // Fetch the latest user data from the database using an API call
      fetchSwitchDataFromDatabase(id)
        .then((switchDetails) => {
          setSwitchDetails(switchDetails);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setSwitchDetails(null);
        });
    }
  }, [id]);

  console.log("Switch Detaild: " + JSON.stringify(switchDetails));

  const selectedBuilding = switchDetails?.building;
  const selectedFloor = switchDetails?.floor;

  console.log("Building Switch Detaild: " + JSON.stringify(selectedBuilding));
  console.log("Building Switch Detaild: " + JSON.stringify(selectedFloor));

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
        _id: selectedBuilding[0]._id,
      },
      floor: {
        _id: selectedFloor[0]._id,
      },
      email: user.email,
    };

    await onFinish(SwitchData);
    navigate("/switch", { replace: true });
  };

  return (
    <EditSwitchForm
      type="Edit"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
      selectedBuilding={selectedBuilding}
      selectedFloor={selectedFloor}
    />
  );
};

export default EditSwitch;
