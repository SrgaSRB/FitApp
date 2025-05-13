import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import AppLayout from './pages/AppLayout';
import HomePage from './components/Home/HomePage';
import NewWorkoutPage from './components/NewWorkout/NewWorkoutPage';
import ProgressPage from './components/Progress/ProgressPage';
import ProfilePage from './components/Profile/ProfilePage';
import ProtectedRoute from './components/Shared/ProtectedRoute';

const App: React.FC = () => {

  return (
    <Routes>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={
        <ProtectedRoute>
        <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="new-workout" element={<NewWorkoutPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default App;
