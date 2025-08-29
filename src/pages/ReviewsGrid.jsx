// src/pages/ReviewsGrid.jsx
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Avatar,
  Flex,
  useColorModeValue,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

const products = [
  {
    id: 1,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "blue",
  },
  {
    id: 2,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "gray",
  },
  {
    id: 3,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "yellow",
  },
  {
    id: 4,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "gray",
  },
  {
    id: 5,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "gray",
  },
  {
    id: 6,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "green",
  },
  {
    id: 7,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "red",
  },
  {
    id: 8,
    title: "Product title goes here",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=300&h=200&fit=crop",
    url: "https://yourproductsluggoeshere123.com",
    status: "Active",
    statusColor: "cyan",
  },
];

const ProductCard = ({ title, image, url, status, statusColor, isListView = false }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (isListView) {
    return (
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        shadow="sm"
        _hover={{ shadow: "md" }}
        transition="all 0.2s"
        mb={4}
      >
        <HStack spacing={4} p={4}>
          <Box position="relative" flexShrink={0}>
            <Badge
              position="absolute"
              top={1}
              left={1}
              colorScheme={statusColor}
              variant="solid"
              fontSize="xs"
              zIndex={1}
            >
              {status}
            </Badge>
            <Image
              src={image}
              alt={title}
              w="120px"
              h="80px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
          
          <VStack flex={1} align="start" spacing={2}>
            <Text fontWeight="semibold" fontSize="md">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {url}
            </Text>
          </VStack>
          
          <HStack spacing={2} flexShrink={0}>
            <Button
              size="sm"
              colorScheme="blue"
              variant="solid"
              fontSize="xs"
            >
              View Details
            </Button>
            <Button
              size="sm"
              colorScheme="gray"
              variant="solid"
              bg="gray.800"
              color="white"
              fontSize="xs"
              _hover={{ bg: "gray.700" }}
            >
              Source
            </Button>
          </HStack>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <Box position="relative">
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme={statusColor}
          variant="solid"
          fontSize="xs"
          zIndex={1}
        >
          {status}
        </Badge>
        <Image
          src={image}
          alt={title}
          w="100%"
          h="200px"
          objectFit="cover"
        />
      </Box>
      
      <VStack p={4} spacing={3} align="stretch">
        <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
          {title}
        </Text>
        
        <Text fontSize="xs" color="gray.500" noOfLines={1}>
          {url}
        </Text>
        
        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme="blue"
            variant="solid"
            fontSize="xs"
            flex={1}
          >
            View Details
          </Button>
          <Button
            size="sm"
            colorScheme="gray"
            variant="solid"
            bg="gray.800"
            color="white"
            fontSize="xs"
            _hover={{ bg: "gray.700" }}
          >
            Source
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default function ReviewsGrid() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const [isListView, setIsListView] = useState(false);

  return (
    <Box minH="100vh" bg={bgColor} p={6}>
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <HStack spacing={4}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                LOGO
              </Text>
            </Box>
            <Text fontSize="2xl" fontWeight="semibold">
              Reviews
            </Text>
          </HStack>
          
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <Input
                placeholder="Search"
                bg={cardBgColor}
                border="1px"
                borderColor="gray.300"
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<SearchIcon />}
                  size="sm"
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            
            <Avatar size="sm" name="John Smith" />
            <VStack spacing={0} align="start">
              <Text fontSize="sm" fontWeight="semibold">
                John Smith
              </Text>
              <Text fontSize="xs" color="gray.500">
                Admin
              </Text>
            </VStack>
          </HStack>
        </Flex>

        {/* Navigation */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Product List
          </Text>
          
          <HStack spacing={4} mb={6}>
            <Button
              colorScheme={!isListView ? "gray" : "gray"}
              variant={!isListView ? "solid" : "outline"}
              bg={!isListView ? "gray.800" : "transparent"}
              color={!isListView ? "white" : "gray.600"}
              size="sm"
              onClick={() => setIsListView(false)}
              _hover={!isListView ? { bg: "gray.700" } : {}}
            >
              Grid View
            </Button>
            <Button
              colorScheme={isListView ? "gray" : "gray"}
              variant={isListView ? "solid" : "outline"}
              bg={isListView ? "gray.800" : "transparent"}
              color={isListView ? "white" : "gray.600"}
              size="sm"
              onClick={() => setIsListView(true)}
              _hover={isListView ? { bg: "gray.700" } : {}}
            >
              List View
            </Button>
          </HStack>
        </Box>

        {/* Products Display */}
        {isListView ? (
          <VStack spacing={0} align="stretch">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} isListView={true} />
            ))}
          </VStack>
        ) : (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {products.map((product) => (
              <ProductCard key={product.id} {...product} isListView={false} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}