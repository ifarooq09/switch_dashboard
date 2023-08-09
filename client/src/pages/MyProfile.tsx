import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Profile } from "components";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const fetchUserDataFromDatabase = (userId: any) => {
  return fetch(`https://switch-dashboard-l646.onrender.com/api/v1/user/${userId}`)
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

const MyProfile = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user && user._id) {
      // Fetch the latest user data from the database using an API call
      fetchUserDataFromDatabase(user._id)
        .then((userData) => {
          setUserData(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
        });
    }
  }, [user]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Profile
      type="My"
      id={userData._id}
      name={userData.name}
      email={userData.email}
      role={userData.role}
      avatar={userData.avatar}
    />
  );
};

export default MyProfile;
