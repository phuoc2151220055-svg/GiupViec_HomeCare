import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import MainLayout from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminLayoutDashboard from './components/admin/AdminLayoutDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import LoginAdmin from './pages/admin/LoginAdmin'
import { useUser } from '@clerk/clerk-react';
import SyncCustomer from './components/SyncCustomer'
import { Toaster } from 'react-hot-toast';
import StaffLayout from './components/staff/StaffLayout'
import StaffLayoutDashboard from './components/staff/StaffLayoutDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminNotFound from './pages/admin/AdminNotFound'
import CustomerListPage from './pages/admin/CustomerListPage'
import EditCustomers from './pages/admin/EditCustomers'
import AddCutomers from './pages/admin/AddCutomers'
import BranchList from './pages/admin/BranchList'
import BranchForm from './components/admin/BranchForm'
import ProfilePage from './pages/admin/ProfilePage'
import ServiceList from './pages/admin/ListService'
import ServiceForm from './components/admin/ServiceForm'
import OrderList from './pages/admin/OrderList'
import OrderDetail from './pages/admin/OrderDetail'
import EmployeeList from './pages/admin/EmployeeList'
import AddEmployee from './pages/admin/AddEmployee'
import EditEmployee from './pages/admin/EditEmployee'
import ProfileStaffPage from './pages/staff/ProfileStaffPage'
import StaffHome from './pages/staff/StaffDashboard'
import StaffWorkPage from './pages/staff/StaffWorkPage'
import StaffSchedulePage from './pages/staff/StaffSchedulePage'
import FeedbackPage from './pages/staff/FeedbackPage'
import AssignShiftsPage from './pages/admin/AssignShiftsPage'

function App() {
   const { user } = useUser();
  return (
    <>
    <div className="">
      {user && <SyncCustomer />}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
     
     
        <Route path="/manager-login" element={<LoginAdmin />} />
        {/* admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminLayoutDashboard />}>
              <Route index element={<AdminDashboard />} />
              <Route path='profile' element={<ProfilePage />} />
              {/* nhân viên */}
              <Route path='employees' element={<EmployeeList />} />
              <Route path='employees/add' element={<AddEmployee />} />
              <Route path='employees/:id' element={<EditEmployee />} />
              {/* khách hàng */}
              <Route path='customers' element={<CustomerListPage />} />
              <Route path='customers/add' element={<AddCutomers />} />
              <Route path='customers/:id' element={<EditCustomers />} />
              {/* chi nhánh */}
              <Route path='branches' element={<BranchList />} />
              <Route path="branches/add" element={<BranchForm />} />
              <Route path="branches/:id" element={<BranchForm />} />
              {/* dịch vụ */}
              <Route path="services" element={<ServiceList />} />
              <Route path="services/add" element={<ServiceForm />} />
              <Route path="services/:id" element={<ServiceForm />} />

              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />

              <Route path="assign-shifts" element={<AssignShiftsPage />} />

              <Route path="*" element={<AdminNotFound />} />
            </Route>
          </Route>
        </Route>
        
        {/* staff */}
        <Route element={<ProtectedRoute allowedRoles={["staff"]}/>} >
           <Route element={<StaffLayout />}>
            <Route path="/staff-dashboard" element={<StaffLayoutDashboard />}>
              <Route index element={<StaffHome />} />
              <Route path='tasks' element={<StaffWorkPage />} />
              <Route path='schedule' element={<StaffSchedulePage />} />
              <Route path='profile' element={<ProfileStaffPage />} />
              <Route path='feedback' element={<FeedbackPage />} />
            </Route>
           </Route>
        </Route>
      </Routes>
    </div>

    <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
          },
        }}
      />
    </>
  )
}

export default App
