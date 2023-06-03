import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>User Dashboard</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h1>You have to login</h1>
        </>
      )}
    </div>
  );
}
