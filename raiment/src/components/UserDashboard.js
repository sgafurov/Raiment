import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";

export default function UserDashboard() {
  const user = useSelector(selectUser);

  return (
    <div>
      <h1>{`Hi ${user.username}!`}</h1>
    </div>
  );
}
