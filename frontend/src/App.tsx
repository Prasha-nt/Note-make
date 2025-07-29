// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Welcome from './pages/Welcome';
// import AuthForm from './pages/Authform';



// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<AuthForm />} />
//         <Route
//           path="/welcome"
//           element={
           
//               <Welcome />
          
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import AuthForm from './pages/Authform';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'; // ✅ Import the new page

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* ✅ Google OAuth redirect handler */}
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
