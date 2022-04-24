import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

const links = [
    {
        name:"Home",
        url: "/",
        component: HomePage,
        auth: true,
    },
    {
        name:"Login",
        url: "/login",
        component: LoginPage,
        guest: true,
    },
    {
        name:"Register",
        url: "/register",
        component: RegisterPage,
        guest: true,
    },
]

export default links;