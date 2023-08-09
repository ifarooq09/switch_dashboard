import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

import BuildingForm from "components/common/BuildingForm";

const CreateBuilding = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const [buildingImage, setBuildingImage] = useState({ name: "", url: "" });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

    reader(file).then((result: string) =>
      setBuildingImage({
        name: file?.name,
        url: result,
      })
    );
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!buildingImage.name) return alert("Please slect an image");

    await onFinish({ ...data, photo: buildingImage.url, email: user.email });
  };

  return (
    <BuildingForm
      type="Add"
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

export default CreateBuilding;
