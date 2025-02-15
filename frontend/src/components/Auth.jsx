// import { useSelector, useDispatch } from "react-redux";
// import { loginUser, registerUser } from "../redux/slices/authSlice"; // Import actions
// import { useState } from "react";

// const Signin = ({ toggleForm }) => {
//   const dispatch = useDispatch();
//   const { error, loading } = useSelector(state => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <form onSubmit={handleSignin}>
//       <h2>Sign In</h2>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit" disabled={loading}>
//         {loading ? "Logging In..." : "Sign In"}
//       </button>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };
