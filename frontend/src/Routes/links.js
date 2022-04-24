import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ChildrenIndexPage from '../pages/Children/Index'
import ChildrenViewPage from '../pages/Children/View'
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
    {
        name:"Children",
        url: "/children",
        component: ChildrenIndexPage,
        auth: true,
    },
    {
        name:"Child",
        url: "/children/:id",
        component: ChildrenViewPage,
        auth: true,
        nested: true
    },
]

export default links;