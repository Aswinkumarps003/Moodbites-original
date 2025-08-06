import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ChatWidgetProvider from '../common/ChatWidgetProvider';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="flew-grow">
        <Outlet />
      </main>
      <ChatWidgetProvider />
      <Footer />
    </div>
  );
};

export default Layout;