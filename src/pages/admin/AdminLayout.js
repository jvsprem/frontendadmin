import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const AdminLayout = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} />
      <Navbar toggleSidebar={toggleSidebar} title={title} />

    <div
  style={{
    marginLeft: isOpen ? "235px" : "0",
    marginTop: "60px",
    padding: "20px",
    transition: "0.3s",
    
  }}
>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
