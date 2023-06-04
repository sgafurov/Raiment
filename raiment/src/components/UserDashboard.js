import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <div>
      <h1>User Dashboard</h1>
      {/* {isLoggedIn ? (
        <>
          <h1>User Dashboard</h1>
        </>
      ) : (
        <>
          <h1>You have to login</h1>
        </>
      )} */}
    </div>
  );
}
