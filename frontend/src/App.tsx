import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import AuthForm from './pages/Authform';
import AuthSuccess from './pages/AuthSuccess';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/welcome"
          element={
           
              <Welcome />
          
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
