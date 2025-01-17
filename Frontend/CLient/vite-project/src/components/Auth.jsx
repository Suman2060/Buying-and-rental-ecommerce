import  { useState } from 'react';

const Signup = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform signup logic
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Sign Up
      </button>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <button type="button" onClick={toggleForm} className="text-indigo-600 underline">
          Sign In
        </button>
      </p>
    </form>
  );
};

const Signin = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = (e) => {
    e.preventDefault();
    // Perform signin logic
  };

  return (
    <form onSubmit={handleSignin} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Sign In
      </button>
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <button type="button" onClick={toggleForm} className="text-indigo-600 underline">
          Sign Up
        </button>
      </p>
    </form>
  );
};

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        {isSignIn ? (
          <Signin toggleForm={toggleForm} />
        ) : (
          <Signup toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
