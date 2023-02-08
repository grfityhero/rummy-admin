import { Routes, Route } from 'react-router-dom';
import { getUserAccountType } from './actions/constant';
import PageNotFound from './pages/404';
import Home from './pages/home';
import Room from './pages/room';
import Reports from './pages/reports';
import Testgrid from './pages/testgrid';
import Subscription from './pages/subscription';
import ResetPassword from './pages/reset-password';
import Verify from './pages/verify';
import Users from './pages/users';

export default function Routing(props) {
    const accountType = getUserAccountType()

    return <Routes>
        <Route exact path='/' element={<Home />}></Route>
        {accountType === "admin" && <Route exact path='/rooms' element={<Room />}></Route>}
        {accountType === "admin" && <Route exact path='/users' element={<Users />}></Route>}

        {/* {accountType === "admin" &&  */}
        {/* <Route exact path='/reports' element={<Reports />}></Route> */}
        {/* } */}
        {/* {accountType === "admin" && <Route exact path='/Testgrid' element={<Testgrid />}></Route>} */}
        {/* {accountType === "admin" && <Route exact path='/subscriptions' element={<Subscription />}></Route>} */}
        {/* <Route exact path='/verify/:id' element={<Verify />}></Route> */}
        {/* <Route exact path='/reset-password/:id' element={<ResetPassword />}></Route> */}
        <Route exact path='/*' element={<PageNotFound />}></Route>

    </Routes>
}
