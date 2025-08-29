// src/pages/Users.jsx
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching users from an API
    setTimeout(() => {
      setUsers([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Michael Brown", email: "michael@example.com" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box>
      <Heading fontSize="2xl" mb={6}>
        Users
      </Heading>

      {loading ? (
        <Spinner />
      ) : (
        <Table variant="simple" bg="white" rounded="md" shadow="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
