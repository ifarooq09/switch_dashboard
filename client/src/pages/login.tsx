import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Box, Container, TextField, Button } from "@mui/material";
import { logo } from "assets";

interface LoginCredentials {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const { mutate: login } = useLogin({
    v3LegacyAuthProviderCompatible: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const user = await login(credentials);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      // Handle login error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <form>
      <Box
        component="div"
        sx={{
          backgroundColor: "#FCFCFC",
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <img src={logo} alt="Mail Logo" width={200} />
            </div>
            <TextField
              type="text"
              name="email"
              label="Email"
              value={credentials.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              color="info"
              sx={{
                marginBottom: "10px",
                marginTop: "10px",
              }}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              color="info"
              value={credentials.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              sx={{
                marginBottom: "10px",
              }}
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                backgroundColor: "#475be8",
                color: "#fcfcfc",
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>
    </form>
  );
};
