import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import CreateClass from "./components/CreateClass";
import CreateParent from "./components/CreateParent";
import CreateStudent from "./components/CreateStudent";
import Schedule from "./components/Schedule";
import EnrollStudent from "./components/EnrollStudent";
import { ToastProvider } from "./components/Toast";
import {
  GraduationCap,
  Users,
  UserPlus,
  Calendar,
  UserCheck,
} from "lucide-react";

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Tạo Lớp", icon: GraduationCap },
    { path: "/create-parent", label: "Tạo Phụ Huynh", icon: Users },
    { path: "/create-student", label: "Tạo Học Sinh", icon: UserPlus },
    { path: "/schedule", label: "Danh Sách Lớp", icon: Calendar },
    { path: "/enroll", label: "Đăng Ký Lớp", icon: UserCheck },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Quản Lý Lớp Học</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<CreateClass />} />
              <Route path="/create-parent" element={<CreateParent />} />
              <Route path="/create-student" element={<CreateStudent />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/enroll" element={<EnrollStudent />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
