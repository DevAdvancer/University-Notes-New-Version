import { useNavigate } from "react-router-dom";
import UserManagement from "@/components/admin/UserManagement";

const UserManagementPage = () => {
  const navigate = useNavigate();

  return <UserManagement onClose={() => navigate('/dashboard')} />;
};

export default UserManagementPage;
