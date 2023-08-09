import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import EditPortForm from "components/common/EditPortForm";

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
  buildingId: string;
}

interface PortData {
  _id: string;
  interfaceDetail: string;
  title: string;
  ciscophone: string;
  mac: string;
  switchDetail: Switch[];
  floor: Floor[];
  building: Building[];
}

const fetchPortDataFromDatabase = (portId: any) => {
  return fetch(`https://switch-dashboard-l646.onrender.com/api/v1/port/${portId}`)
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

const EditPort = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const [portDetails, setPortDetails] = useState<PortData | null>(
    null
  );

  useEffect(() => {
    if (id) {
      // Fetch the latest user data from the database using an API call
      fetchPortDataFromDatabase(id)
        .then((portDetails) => {
          setPortDetails(portDetails);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setPortDetails(null);
        });
    }
  }, [id]);

  const selectedBuilding = portDetails?.building
  const selectedFloor = portDetails?.floor
  const switchData = portDetails?.switchDetail


  const onFinishHandler = async (data: FieldValues) => {
    if (!selectedBuilding) {
      console.error("No building selected!");
      return;
    }

    if (!selectedFloor) {
      console.error("No Floor selected!");
      return;
    }

    if (!switchData) {
      console.error("No Switch selected!");
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
      switchDetail: {
        _id: switchData[0]._id
      },
      email: user?.email,
    };

    await onFinish(SwitchData);
    navigate("/port", { replace: true });
  };

  return (
    <EditPortForm
      type="Edit"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
      selectedBuilding={selectedBuilding}
      selectedFloor={selectedFloor}
      selectedSwitch={switchData?.[0]?.title ?? ""}
      selectedSwitchIP={switchData?.[0]?.ip ?? ""}
    />
  );
};

export default EditPort;
