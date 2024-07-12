import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme } from "../../context";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

const AdminUserPanel = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const allPage = Math.ceil(users.length / pageSize);

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
          {users?.slice((page - 1) * pageSize, page * pageSize).map((user) => (
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
      <div className="p-2 space-x-4 w-full flex justify-center">
        <button
          disabled={page <= 1}
          onClick={() => setPage((current) => current - 1)}
          className="disabled:text-gray-500"
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
        <input
          type="text"
          value={+page}
          onChange={(event) => setPage(() => +event.target.value)}
          className="bg-transparent text-center w-20 outline-none"
        />
        <button
          disabled={allPage === page}
          onClick={() => {
            setPage((current) => current + 1);
          }}
          className="disabled:text-gray-500"
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
      <div className="">
        <pre className="text-xs">
          Role: 1 - Head Admin, 2 - Admin, 3 - Moderator, 4 - User
        </pre>
      </div>
    </div>
  );
};

export default AdminUserPanel;
