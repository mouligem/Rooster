import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css'
import Register from './Register.jsx'
import Login from './Login.jsx'
import About from './components/About.jsx'
import Event from './components/Event.jsx'
import Contact from './components/Contact.jsx'
import Menu from './components/Menu.jsx'

// import BookingForm from './components/BookingForm.jsx'
import Admin from './Admin.jsx'
import OrderManagement from './orderMgt.jsx'
import PaymentPage from './components/PaymentPage.jsx'
import Products from './components/Products.jsx'
import BookTable from './components/BookTable.jsx'
import Delivery from './components/HomeDelivery.jsx'
import TakeAway from './components/TakeAway.jsx'
import OrderPage from './components/OrderPage.jsx'
import HistoryOfOrders from './components/HistoryOfOrders.jsx'
import FeedBack from './components/FeedBack.jsx'
import CompletedOrders from './components/CompletedOrders.jsx'
import EventPayment from './components/EventPayment.jsx'
import AdminEvents from './components/AdminEvent.jsx'
import Users from './components/Users.jsx'
import AllOrders from './components/AllOrders.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<App/>}></Route>
   <Route path='/register' element={<Register/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/app' element={<App/>}></Route>
    <Route path='/about' element={<About/>}></Route>
    <Route path='/event' element={<Event/>}></Route>
    <Route path='/contact' element={<Contact/>}></Route>
    <Route path='/menu' element={<Menu/>}></Route>
    {/* <Route path='/bookingform' element={<BookingForm/>}></Route> */}
    <Route path='/admin' element={<Admin/>}></Route>
    <Route path='/payment' element={<PaymentPage/>}></Route>
    <Route path='/admin/orders' element={<OrderManagement/>}></Route>
    <Route path='/admin/products' element={<Products/>}></Route>
    <Route path='/admin/history' element={<HistoryOfOrders/>}></Route>
    <Route path='/book-table' element={<BookTable/>}></Route> 
    <Route path='/home-delivery' element={<Delivery/>}></Route> 
    <Route path='/take-away' element={<TakeAway/>}></Route> 
    <Route path="/order" element={<OrderPage />} />
    <Route path="/admin/feedback" element={<FeedBack />} />
    <Route path="/admin/event" element={<AdminEvents />} />
    <Route path="/admin/completedorders" element={<CompletedOrders />} />
    <Route path="/admin/userdetails" element={<Users />} />
    <Route path="/event-payment" element={<EventPayment />} />
    <Route path="/allorders" element={<AllOrders />} />
   </Routes>
   </BrowserRouter>
  </React.StrictMode>,
  
)
