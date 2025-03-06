import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

interface NavbarProps {
  user?: {
    username: string;
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-secondary py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-text flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          TrailQuest
        </Link>
        
        <div className="flex space-x-6 items-center">
          <Link to="/parks" className="text-text hover:text-primary-light transition-colors">
            Parks
          </Link>
          <Link to="/trips" className="text-text hover:text-primary-light transition-colors">
            My Trips
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-text">Hello, {user.username}</span>
              <button 
                onClick={handleSignOut}
                className="btn btn-primary text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
