import React, { useState } from 'react';
import axios from 'axios';
type Props = {
  handleBackBtn: (e: React.MouseEvent<HTMLButtonElement>)=> void;
  handleLogIn: (e: React.MouseEvent<HTMLButtonElement>)=> void;
}
const Signup: React.FC<Props> = ({handleBackBtn,handleLogIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success,setSuccess] = useState<boolean>(false);
  const backendUrl = process.env.NEXT_PUBLIC_RENDER_URL;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      console.log('backendUrl',backendUrl);
      const response = await axios.post(`${backendUrl}/signup`, { email, password });
      console.log("response", response,backendUrl);
      if (response.status === 201) {
        alert('Signup successful!');
        // router.push('/login');
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signupCont flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <button className="backBtn" onClick={handleBackBtn}>Back</button>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {success && <div className="success">Signed up successfully!</div>}



          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <button onClick={handleLogIn} className="text-blue-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
