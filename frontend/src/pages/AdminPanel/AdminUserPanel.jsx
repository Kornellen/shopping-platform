import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme } from "../../context";
import axios from "axios";
import { tr } from "date-fns/locale";
import { Link } from "react-router-dom";

const AdminUserPanel = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const { data } = await axios.get("/api/users");

        return setUsers(data.result);
      } catch (error) {
        setError(error);
      } finally {
        setError(null);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={`${pagesVariant[theme]} text-3xl text-center`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${pagesVariant[theme]} text-3xl text-center`}>
        An Error Occuried
      </div>
    );
  }

  return (
    <div
      className={`${pagesVariant[theme]} text-3xl flex justify-center items-center flex-wrap`}
    >
      <table className="p-2">
        <thead className="p-2 divide-x-2 border-2 m-2">
          <tr className="border-2 divide-x-4 text-center">
            <th className="p-2">UserID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">First name</th>
            <th className="p-2">Last name</th>
            <th className="p-2">Gender</th>
            <th className="p-2">Phone number</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody className="p-2 divide-x-2 border-2 m-2">
          {users?.map((user) => (
            <tr key={user.userID} className="border-2 divide-x-4 text-center">
              <td className="p-2">{user.userID}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">
                <Link
                  to={`mailto:${user.email}?subject=From%20Shopping_Platform%20Admin`}
                >
                  {user.email}
                </Link>
              </td>
              <td className="p-2">{user.firstName}</td>
              <td className="p-2">{user.lastName}</td>
              <td className="p-2">{user.gender}</td>
              <td className="p-2">{user.phoneNumber}</td>
              <td className="p-2">{user.createdAt}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre className="text-xs">
        Role: 1 - Head Admin, 2 - Admin, 3 - Moderator, 4 - User
      </pre>
    </div>
  );
};

export default AdminUserPanel;
