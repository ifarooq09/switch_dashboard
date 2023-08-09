import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import UserForm from "components/common/UserForm";

const CreateUser = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });
  const [userImage, setUserImage] = useState({ name: "", url: "" });
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
      setUserImage({
        name: file?.name,
        url: result,
      })
    );
  };

  const onFinishHandler = async (data: FieldValues) => {

    const userData = {
      ...data,
      avatar: userImage.url
    }
    
    console.log("data to be inserted: " + JSON.stringify(userData))

    await onFinish(userData);
    navigate("/user", { replace: true });
  }

  return (
    <UserForm
      type="Add"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}  
      handleImageChange={handleImageChange}
      userImage={userImage}
    />
  );
};

export default CreateUser;
