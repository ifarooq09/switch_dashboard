import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { useNavigate, useParams} from "react-router-dom";

import UserForm from "components/common/UserForm";
import EditUserForm from "components/common/EditUserForm";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const fetchUserDataFromDatabase = (userId: any) => {
  return fetch(`http://localhost:8080/api/v1/user/${userId}`)
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

const EditUser = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true
  });

  const [userDetails, setUserDetails] = useState<UserData | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Fetch the latest user data from the database using an API call
      fetchUserDataFromDatabase(id)
        .then((userDetails) => {
          setUserDetails(userDetails);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserDetails(null);
        });
    }
  }, [id]);

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

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);

  const role = userDetails?.role

  const onFinishHandler = async (data: FieldValues) => {
    const userData = {
      ...data,
      avatar: userImage.url || userDetails?.avatar
    };
    
    console.log("data to be inserted: " + JSON.stringify(userData));

    await onFinish(userData);


    if (isAdmin) {
      navigate("/user", { replace: true });
    } else {
      navigate("/my-profile", { replace: true });
    }
    
  }

  return isAdmin ? (
    <UserForm
      type="Edit"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}  
      handleImageChange={handleImageChange}
      userImage={userImage}
      role={role}
    />
  ) : (
    <EditUserForm 
      type="Edit"
      register={register}
      formLoading={formLoading}
      onFinish={onFinishHandler}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}  
      handleImageChange={handleImageChange}
      userImage={userImage}
      isAdmin={isEditor}
    />
  );
};

export default EditUser;
