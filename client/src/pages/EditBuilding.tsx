import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";


import BuildingForm from "components/common/BuildingForm";

interface BuildingData {
  buildingName: string;
  photo: string;
}

const fetchBuildingDataFromDatabase = (userId: any) => {
  return fetch(`http://localhost:8080/api/v1/building/${userId}`)
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

const EditBuilding = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const [buildingImage, setBuildingImage] = useState({ name: "", url: "" });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();
  const { id } = useParams();

  const [buildingDetails, setBuildingDetails] = useState<BuildingData | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the latest user data from the database using an API call
      fetchBuildingDataFromDatabase(id)
        .then((buildingDetails) => {
          setBuildingDetails(buildingDetails);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setBuildingDetails(null);
        });
    }
  }, [id]);

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

      reader(file)
      .then((result: string) =>
        setBuildingImage({
          name: file?.name || "",
          url: result,
        })
      )
      .catch((error) => {
        console.error("Error reading image file:", error);
        setBuildingImage({ name: "", url: "" });
      });
  };

  const onFinishHandler = async (data: FieldValues) => {
    // Check if a new image is not uploaded
    if (!buildingImage.name) {
      // If there is no new image, check if there is a stored image in the database
      if (buildingDetails && buildingDetails.photo) {
        // If a stored image exists, use it in the form submission
        await onFinish({ ...data, photo: buildingDetails.photo, email: user.email });
      } else {
        // Handle the case where there is no new image and no stored image in the database.
        // You might want to decide what to do in this scenario, such as showing an error message to the user.
        console.error("No image is uploaded, and there is no stored image in the database.");
      }
    } else {
      // If a new image is uploaded, use the new image in the form submission
      await onFinish({ ...data, photo: buildingImage.url, email: user.email });
    }
  };

  return (
    <BuildingForm
      type="Edit"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
      buildingImage={buildingImage}
    />
  );
};

export default EditBuilding;
