// src/pages/UsersList.jsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

export default function UsersList() {
  return (
    <Box>
      <Heading fontSize="2xl" mb={6}>
        Users
      </Heading>

      <Box
        bg="white"
        p={5}
        rounded="md"
        shadow="md"
        border="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Avatar
                    size="sm"
                    name={user.name}
                    src={user.avatar}
                    mr={3}
                  />
                  <Text display="inline">{user.name}</Text>
                </Td>
                <Td>{user.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
