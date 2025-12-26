import { Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="w-full bg-primary border-b border-primary-foreground/10">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <span className="font-heading text-xl text-primary-foreground font-bold">
              HostelHub
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/') 
                  ? 'text-secondary' 
                  : 'text-primary-foreground hover:text-secondary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/students" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/students') 
                  ? 'text-secondary' 
                  : 'text-primary-foreground hover:text-secondary'
              }`}
            >
              Students
            </Link>
            <Link 
              to="/rooms" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/rooms') 
                  ? 'text-secondary' 
                  : 'text-primary-foreground hover:text-secondary'
              }`}
            >
              Rooms
            </Link>
            <Link 
              to="/allocations" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/allocations') 
                  ? 'text-secondary' 
                  : 'text-primary-foreground hover:text-secondary'
              }`}
            >
              Allocations
            </Link>
          </nav>
          
          <Link 
            to="/admin" 
            className="px-6 py-2.5 bg-buttonbackground text-secondary-foreground font-paragraph text-base font-semibold rounded-lg hover:brightness-95 transition-all"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </header>
  );
}
