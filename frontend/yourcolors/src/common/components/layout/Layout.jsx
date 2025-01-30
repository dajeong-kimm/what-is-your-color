import Header from './Header';
import Footer from './footer';

import { Outlet } from 'react-router-dom';

function Layout({title, footermessage}) {
    return (
        <div>
            <Header title={title} />
            <Outlet />
            <Footer message={footermessage} />
        </div>
    );
}

export default Layout;