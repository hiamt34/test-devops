import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Có lỗi xảy ra";

    // Handle different error status codes
    if (error.response?.status === 401) {
      // Handle unauthorized
      // logout()
    } else if (error.response?.status === 403) {
      // Handle forbidden
    } else if (error.response?.status >= 500) {
      // Handle server errors
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// API functions
export const apiService = {
  // Classes API
  createClass: (data: {
    name: string;
    subject: string;
    dayOfWeek: number;
    timeSlot: string;
    teacherName: string;
    maxStudents: number;
  }) => apiClient.post("/api/classes", data),

  getClasses: () => apiClient.get("/api/classes"),

  getAllClasses: () => apiClient.get("/api/classes/all"),

  // Parents API
  createParent: (data: { name: string; phone: string; email: string }) =>
    apiClient.post("/api/parents", data),

  getParents: () => apiClient.get("/api/parents"),

  // Students API
  createStudent: (data: {
    name: string;
    dob: string;
    gender: string;
    currentGrade: number;
    parentId: string;
  }) => apiClient.post("/api/students", data),

  getStudents: () => apiClient.get("/api/students"),

  // Enrollment API
  registerStudent: (classId: string, data: { studentId: string }) =>
    apiClient.post(`/api/classes/${classId}/register`, data),
};

export default apiClient;
