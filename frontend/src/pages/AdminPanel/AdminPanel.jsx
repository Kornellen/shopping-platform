import { Link, Outlet } from "react-router-dom";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme } from "../../context";

const AdminPanel = () => {
  const { theme } = useTheme();

  return (
    <div className={`${pagesVariant[theme]} text-3xl flex flex-col`}>
      <div className="text-center h-32">
        <h1 className="p-2">Admin Dashboard</h1>
        <div className="flex space-x-2 border-2">
          <div className="p-2 border-2 rounded m-2 hover:border-blue-400 hover:text-blue-400">
            <Link to={"users"}>Users</Link>
          </div>
          <div className="p-2 border-2 rounded m-2 hover:border-blue-400 hover:text-blue-400">
            <Link to={"products"}>Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
