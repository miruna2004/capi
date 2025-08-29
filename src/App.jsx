// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
// import Todos from "./pages/Todos"; // Remove old Todos import
import EnhancedTodos from "./components/EnhancedTodos"; // Add new enhanced todos
// import Categories from "./pages/Categories"; // Remove old Categories import
import EnhancedCategories from "./components/EnhancedCategories"; // Add enhanced categories
import ReviewsGrid from "./pages/ReviewsGrid";
import UsersList from "./pages/UsersList";
import EnhancedLayout from "./components/EnhancedLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <EnhancedLayout>
                    <Navigate to="/dashboard" />
                  </EnhancedLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <EnhancedLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/todos" element={<EnhancedTodos />} />
                      <Route path="/categories" element={<EnhancedCategories />} />
                      <Route path="/reviews" element={<ReviewsGrid />} />
                      <Route path="/keywords" element={<div>Keywords Page</div>} />
                      <Route path="/crawler" element={<div>Web Crawler Page</div>} />
                      <Route path="/notifications" element={<div>Notifications Page</div>} />
                      <Route path="/settings" element={<div>Settings Page</div>} />
                      <Route path="/users" element={<UsersList />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </EnhancedLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;