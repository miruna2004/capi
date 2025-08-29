import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  Container,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { AuthContext } from "../Password";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container centerContent py={12}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%" maxW="md">
        <Heading textAlign="center" size="lg" mb={4}>
          Dashboard
        </Heading>
        <Text textAlign="center" mb={6}>
          Welcome to your dashboard! (Private Route)
        </Text>

        <Popover placement="bottom">
          <PopoverTrigger>
            <Button colorScheme="teal" width="100%">
              User Menu
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Account Options</PopoverHeader>
            <PopoverBody>
              <Button colorScheme="red" width="100%" onClick={handleLogout}>
                Logout
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Container>
  );
};

export default Home;
