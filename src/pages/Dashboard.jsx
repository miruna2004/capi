// src/pages/Dashboard.jsx - REPLACE YOUR CURRENT Dashboard.jsx WITH THIS
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Flex,
  Icon,
  Button,
  useColorModeValue,
  SimpleGrid,
  HStack,
  Badge,
  VStack,
  Skeleton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Avatar,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import {
  MdCheckCircle,
  MdPending,
  MdPlaylistAdd,
  MdTrendingUp,
  MdStar,
  MdShowChart,
  MdArrowUpward,
  MdArrowDownward,
  MdFullscreen,
} from 'react-icons/md';
import { useTodoStats, useTodos } from '../hooks/useTodos';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
  50% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.6); }
  100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useTodoStats();
  const { data: todos, isLoading: todosLoading } = useTodos();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  
  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });
  const headerSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  
  // Get user info from auth context
  const { currentUser, backendUser } = useAuth();
  
  // Use backend user data if available, fallback to Firebase user
  const displayUser = backendUser || currentUser;
  const userName = displayUser?.first_name || displayUser?.displayName?.split(' ')[0] || displayUser?.email?.split('@')[0] || 'User';
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );
  const glassStyle = {
    bg: useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)'),
    backdropFilter: 'blur(20px)',
    borderWidth: '1px',
    borderColor: useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'),
  };

  // Mock data for charts
  const analyticsData = [
    { month: 'Jan', listingsRemoved: 4200, noticesSent: 2400, noticesRejected: 400 },
    { month: 'Feb', listingsRemoved: 3100, noticesSent: 1398, noticesRejected: 210 },
    { month: 'Mar', listingsRemoved: 5200, noticesSent: 2800, noticesRejected: 290 },
    { month: 'Apr', listingsRemoved: 2780, noticesSent: 3908, noticesRejected: 300 },
    { month: 'May', listingsRemoved: 1890, noticesSent: 4800, noticesRejected: 181 },
    { month: 'Jun', listingsRemoved: 2390, noticesSent: 3800, noticesRejected: 250 },
    { month: 'Jul', listingsRemoved: 3490, noticesSent: 4300, noticesRejected: 210 },
    { month: 'Aug', listingsRemoved: 2100, noticesSent: 2400, noticesRejected: 250 },
    { month: 'Sep', listingsRemoved: 5100, noticesSent: 4800, noticesRejected: 400 },
    { month: 'Oct', listingsRemoved: 4700, noticesSent: 3200, noticesRejected: 350 },
    { month: 'Nov', listingsRemoved: 5800, noticesSent: 5200, noticesRejected: 450 },
    { month: 'Dec', listingsRemoved: 6200, noticesSent: 5500, noticesRejected: 380 },
  ];

  // Chart data for New Notices trend
  const noticesChartData = [
    { name: 'Jul', value: 1800 },
    { name: 'Aug', value: 2100 },
    { name: 'Sep', value: 2800 },
    { name: 'Oct', value: 2200 },
    { name: 'Nov', value: 2600 },
    { name: 'Dec', value: 2395 },
  ];

  const platforms = ['All', 'Choose Platform', 'Alibaba', 'AliExpress'];
  const recentTodos = Array.isArray(todos) ? todos.slice(0, 3) : [];

  if (statsLoading || todosLoading) {
    return (
      <Box p={containerPadding} bgGradient={bgGradient} minH="100vh">
        <VStack spacing={cardSpacing}>
          <Skeleton height="60px" width={{ base: "280px", md: "300px" }} />
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={cardSpacing} width="100%">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height="150px" />
            ))}
          </SimpleGrid>
          <Skeleton height="400px" width="100%" />
        </VStack>
      </Box>
    );
  }

  const StatCard = ({ icon, title, value, change, color, trend, subtitle, showChart = false, chartData = [] }) => (
    <Card
      {...glassStyle}
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: isMobile ? 'none' : 'translateY(-8px)',
        boxShadow: isMobile ? 'lg' : '0 20px 40px rgba(0,0,0,0.1)',
      }}
      css={{
        animation: `${slideIn} 0.6s ease-out`,
      }}
      borderRadius={{ base: "xl", md: "2xl" }}
    >
      <CardBody p={{ base: 4, md: 6 }}>
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Box
            p={{ base: 2, md: 3 }}
            borderRadius="xl"
            bg={`${color}.100`}
            color={`${color}.600`}
            css={!isMobile ? {
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            } : {}}
          >
            <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
          </Box>
          <Box textAlign="right">
            <HStack spacing={1}>
              <Icon 
                as={trend === 'up' ? MdArrowUpward : MdArrowDownward} 
                color={trend === 'up' ? 'green.500' : 'red.500'}
                boxSize={4}
              />
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color={trend === 'up' ? 'green.500' : 'red.500'}>
                {change}
              </Text>
            </HStack>
          </Box>
        </Flex>
        
        <VStack align="flex-start" spacing={2}>
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.600">
            {title}
          </Text>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" bgGradient={`linear(to-r, ${color}.400, ${color}.600)`} bgClip="text">
            {value}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={isMobile ? 2 : 1}>
            {subtitle}
          </Text>
        </VStack>

        {/* Chart for non-mobile or when requested */}
        {showChart && chartData.length > 0 && !isMobile && (
          <Box mt={4} height="60px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`colorGradient${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--chakra-colors-${color}-400)`} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={`var(--chakra-colors-${color}-400)`} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={`var(--chakra-colors-${color}-500)`}
                  strokeWidth={2}
                  fill={`url(#colorGradient${color})`}
                  dot={false}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis hide />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Subtle background pattern */}
        <Box
          position="absolute"
          top="0"
          right="0"
          width="100px"
          height="100px"
          bgGradient={`linear(to-br, ${color}.100, transparent)`}
          borderRadius="full"
          transform="translate(30px, -30px)"
          opacity={0.3}
        />
      </CardBody>
    </Card>
  );

  return (
    <Box 
      bgGradient={bgGradient} 
      minH="100vh" 
      p={containerPadding}
      pb={{ base: 20, md: containerPadding }} // Extra bottom padding for mobile
    >
      <VStack spacing={cardSpacing} position="relative" zIndex={1}>
        {/* Enhanced Header */}
        <Card {...glassStyle} width="100%" borderRadius={{ base: "xl", md: "2xl" }}>
          <CardBody p={{ base: 4, md: 6, lg: 8 }}>
            <Stack 
              direction={{ base: "column", md: "row" }}
              justify="space-between" 
              align={{ base: "flex-start", md: "center" }}
              spacing={4}
            >
              <VStack align="flex-start" spacing={2}>
                <Heading 
                  size={headerSize}
                  bgGradient="linear(to-r, purple.400, blue.400, teal.400)" 
                  bgClip="text"
                  fontWeight="black"
                  textAlign={{ base: "center", md: "left" }}
                  w={{ base: "full", md: "auto" }}
                >
                  Welcome Back, {userName}! 🚀
                </Heading>
                <Stack direction={{ base: "column", sm: "row" }} spacing={4} align={{ base: "center", sm: "flex-start" }}>
                  <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="sm">
                    Wednesday, October 27
                  </Badge>
                  <HStack spacing={2}>
                    <Box w={2} h={2} bg="green.400" borderRadius="full" />
                    <Text fontSize="sm" color="gray.600">All systems operational</Text>
                  </HStack>
                </Stack>
              </VStack>
              
              <Stack direction={{ base: "row", md: "row" }} spacing={2} flexWrap="wrap" justify={{ base: "center", md: "flex-end" }}>
                {platforms.map((platform) => (
                  <Button
                    key={platform}
                    size={{ base: "xs", md: "sm" }}
                    variant={selectedPlatform === platform ? "solid" : "ghost"}
                    colorScheme={selectedPlatform === platform ? "purple" : "gray"}
                    borderRadius="full"
                    onClick={() => setSelectedPlatform(platform)}
                    transition="all 0.3s ease"
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 2, md: 4 }}
                    _hover={{
                      transform: isMobile ? 'none' : 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    {platform}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </CardBody>
        </Card>

        {/* Enhanced Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={cardSpacing} width="100%">
          <StatCard
            icon={MdTrendingUp}
            title="Number of Takedowns"
            value="593,568"
            change="+20%"
            color="blue"
            trend="up"
            subtitle="October 2023 • +15,230 from last month"
          />
          
          <StatCard
            icon={MdStar}
            title="% of Goods Scraped"
            value="92.85%"
            change="+5.2%"
            color="orange"
            trend="up"
            subtitle="October 2023 • Above target"
          />
          
          <StatCard
            icon={MdShowChart}
            title="New Notices"
            value="2,395"
            change="+12%"
            color="green"
            trend="up"
            subtitle="October 2023 • Peak performance"
            showChart={true}
            chartData={noticesChartData}
          />
          
          <StatCard
            icon={MdPlaylistAdd}
            title="Personal Todos"
            value={stats?.total || 0}
            change={stats?.completion_rate ? `${stats.completion_rate}%` : "0%"}
            color="purple"
            trend="up"
            subtitle="Task management • Stay organized"
          />
        </SimpleGrid>

        {/* Enhanced Analytics & Todo Section */}
        <Grid 
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
          gap={cardSpacing} 
          width="100%"
        >
          {/* Analytics Chart */}
          <Card {...glassStyle} borderRadius={{ base: "xl", md: "2xl" }} overflow="hidden">
            <CardBody p={{ base: 4, md: 6 }}>
              <Stack 
                direction={{ base: "column", md: "row" }}
                justify="space-between" 
                align={{ base: "flex-start", md: "center" }}
                mb={6}
                spacing={4}
              >
                <VStack align="flex-start" spacing={1}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    Analytics Overview
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Performance metrics across all platforms
                  </Text>
                </VStack>
                
                {!isMobile && (
                  <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 2, md: 6 }}>
                    <HStack spacing={2}>
                      <Box w={3} h={3} bg="#667eea" borderRadius="full" />
                      <Text fontSize="sm" color="gray.600" fontWeight="500">Listings Removed</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Box w={3} h={3} bg="#48bb78" borderRadius="full" />
                      <Text fontSize="sm" color="gray.600" fontWeight="500">Notices Sent</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Box w={3} h={3} bg="#fc8181" borderRadius="full" />
                      <Text fontSize="sm" color="gray.600" fontWeight="500">Notices Rejected</Text>
                    </HStack>
                    <Tooltip label="Expand chart">
                      <Button size="sm" variant="ghost" onClick={onOpen}>
                        <Icon as={MdFullscreen} />
                      </Button>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
              
              <Box height={{ base: "200px", md: "300px" }} px={{ base: 2, md: 6 }} pb={{ base: 2, md: 6 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: '#6B7280' }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value, name) => [value.toLocaleString(), name]}
                    />
                    <Bar 
                      dataKey="listingsRemoved" 
                      name="Listings Removed"
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={isMobile ? 20 : 40}
                    />
                    <Bar 
                      dataKey="noticesSent" 
                      name="Notices Sent"
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={isMobile ? 20 : 40}
                    />
                    <Bar 
                      dataKey="noticesRejected" 
                      name="Notices Rejected"
                      fill="#EF4444" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={isMobile ? 20 : 40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Enhanced Todo Section */}
          <VStack spacing={cardSpacing} height="100%">
            {/* Todo Progress */}
            <Card {...glassStyle} borderRadius={{ base: "xl", md: "2xl" }} width="100%">
              <CardBody p={{ base: 4, md: 6 }}>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    My Todos
                  </Heading>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    borderRadius="full"
                    onClick={() => navigate('/todos')}
                    leftIcon={<Icon as={MdPlaylistAdd} />}
                  >
                    {isMobile ? "All" : "View All"}
                  </Button>
                </Flex>
                
                <VStack spacing={4}>
                  <Box width="100%" textAlign="center">
                    <CircularProgress
                      value={stats?.completion_rate || 0}
                      size={{ base: "80px", md: "100px" }}
                      thickness="8px"
                      color="purple.400"
                      trackColor="gray.100"
                    >
                      <CircularProgressLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                        {stats?.completion_rate || 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  
                  <SimpleGrid columns={2} spacing={4} width="100%">
                    <VStack>
                      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="green.500">
                        {stats?.completed || 0}
                      </Text>
                      <Text fontSize="sm" color="gray.600">Completed</Text>
                    </VStack>
                    <VStack>
                      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="orange.500">
                        {stats?.pending || 0}
                      </Text>
                      <Text fontSize="sm" color="gray.600">Pending</Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Todos */}
            <Card {...glassStyle} borderRadius={{ base: "xl", md: "2xl" }} width="100%" flex={1}>
              <CardBody p={{ base: 4, md: 6 }}>
                <Heading size="sm" mb={4} color="gray.700">
                  Recent Tasks
                </Heading>
                
                {recentTodos.length === 0 ? (
                  <VStack spacing={3} py={8}>
                    <Icon as={MdPlaylistAdd} boxSize={12} color="gray.300" />
                    <Text color="gray.500" textAlign="center" fontSize="sm">
                      No todos yet
                    </Text>
                    <Button 
                      size="sm" 
                      colorScheme="purple" 
                      variant="outline"
                      onClick={() => navigate('/todos')}
                    >
                      Create First Todo
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={3}>
                    {recentTodos.map((todo) => (
                      <Flex
                        key={todo.id}
                        align="center"
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                        width="100%"
                        transition="all 0.2s"
                        _hover={{ bg: 'gray.100', transform: isMobile ? 'none' : 'translateX(4px)' }}
                      >
                        <Icon 
                          as={todo.completed ? MdCheckCircle : MdPending}
                          color={todo.completed ? 'green.500' : 'orange.500'}
                          mr={3}
                        />
                        <VStack align="flex-start" spacing={0} flex={1}>
                          <Text 
                            fontSize="sm"
                            fontWeight="medium" 
                            textDecoration={todo.completed ? 'line-through' : 'none'}
                            color={todo.completed ? 'gray.500' : 'gray.800'}
                            noOfLines={1}
                          >
                            {todo.title}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {todo.priority} priority
                          </Text>
                        </VStack>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </VStack>
        </Grid>

        {/* Enhanced Bottom Section - Stack on mobile */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={cardSpacing} width="100%">
          {/* Notifications */}
          <Card {...glassStyle} borderRadius={{ base: "xl", md: "2xl" }}>
            <CardBody p={{ base: 4, md: 6 }}>
              <Flex justify="space-between" align="center" mb={6}>
                <VStack align="flex-start" spacing={1}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    Notifications of Take Downs
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Latest enforcement actions
                  </Text>
                </VStack>
                <Button size="sm" variant="ghost" color="purple.500">
                  View all
                </Button>
              </Flex>
              
              <VStack spacing={4}>
                {[
                  { text: "Mademoiselle 3.4fl.oz 100 ml perfume, CHANEL", time: "1 min ago", severity: "high" },
                  { text: "Cigarettes Crush balls Aroma, BLUE", time: "2 mins ago", severity: "medium" },
                  { text: "Premium Watch Collection, ROLEX Style", time: "5 mins ago", severity: "high" },
                ].map((notification, index) => (
                  <Flex key={index} align="flex-start" p={4} bg="gray.50" borderRadius="lg" width="100%">
                    <Box
                      w={3}
                      h={3}
                      bg={notification.severity === 'high' ? 'red.400' : 'orange.400'}
                      borderRadius="full"
                      mt={2}
                      mr={3}
                      css={notification.severity === 'high' && !isMobile ? {
                        animation: `${pulseGlow} 2s infinite`
                      } : {}}
                    />
                    <VStack align="flex-start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={isMobile ? 2 : 1}>
                        {notification.text}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {notification.time}
                      </Text>
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Top Sellers */}
          <Card {...glassStyle} borderRadius={{ base: "xl", md: "2xl" }}>
            <CardBody p={{ base: 4, md: 6 }}>
              <Flex justify="space-between" align="center" mb={6}>
                <VStack align="flex-start" spacing={1}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    Top 5 Fake Sellers
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    High-risk accounts to monitor
                  </Text>
                </VStack>
                <Button size="sm" variant="ghost" color="purple.500">
                  View all
                </Button>
              </Flex>
              
              <VStack spacing={4}>
                {[
                  { name: "Ross Meadows", listing: "#824564", risk: "high", avatar: "RM" },
                  { name: "Maiden Express", listing: "#598345", risk: "high", avatar: "ME" },
                  { name: "Edison Norman", listing: "#538110", risk: "medium", avatar: "EN" },
                  { name: "Bernadine Cooner", listing: "#589243", risk: "medium", avatar: "BC" },
                  { name: "Chris Valentine", listing: "#523350", risk: "low", avatar: "CV" },
                ].map((seller, index) => (
                  <Flex key={index} align="center" p={4} bg="gray.50" borderRadius="lg" width="100%">
                    <Avatar
                      size="sm"
                      name={seller.name}
                      bg={seller.risk === 'high' ? 'red.400' : seller.risk === 'medium' ? 'orange.400' : 'green.400'}
                      color="white"
                      mr={4}
                    />
                    <VStack align="flex-start" spacing={0} flex={1}>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {seller.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Listing {seller.listing}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={seller.risk === 'high' ? 'red' : seller.risk === 'medium' ? 'orange' : 'green'}
                      borderRadius="full"
                      px={3}
                      fontSize="xs"
                    >
                      {seller.risk}
                    </Badge>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      {/* Enhanced Modal for Chart */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "6xl" }}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="white" borderRadius={{ base: "none", md: "2xl" }} m={{ base: 0, md: 4 }}>
          <ModalCloseButton />
          <ModalBody p={{ base: 4, md: 8 }}>
            <VStack spacing={6}>
              <Heading size={{ base: "md", md: "lg" }}>Analytics Overview - Detailed View</Heading>
              <Box height={{ base: "300px", md: "500px" }} width="100%">
                <Text color="gray.500" textAlign="center" pt={40}>
                  Detailed chart visualization would be here
                </Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;