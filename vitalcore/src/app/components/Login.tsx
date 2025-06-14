import React, { useState,useEffect } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: () => void; // Add the onLoginSuccess prop
  handleBackBtn: (e: React.MouseEvent<HTMLButtonElement>)=> void;
}
// type Props = {
//   handleBackBtn: (e: React.MouseEvent<HTMLButtonElement>)=> void;
// }

const Login: React.FC<LoginProps> = ({ handleBackBtn,onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success,setSuccess] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_RENDER_URL;
  useEffect(()=>{
    if(success){
      const timer = setTimeout(()=>{
        onLoginSuccess();
      },2000)
      return () => clearTimeout(timer);
    }
  },[success])



  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();


    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });

      // Assuming a successful login returns a 200 status
      if (response.status === 200) {
        console.log('Login successful');
        setSuccess(true);
        // onLoginSuccess(); // Trigger the onLoginSuccess callback passed as a prop
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="loginCont flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <button className="backBtn" onClick={handleBackBtn}>Back</button>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {success && <div className="success">Signed up successfully!</div>}


          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
