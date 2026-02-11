import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  ClipboardList,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import shinyPathLogo from '@/assets/shiny-path-logo.svg';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Submissions', url: '/submissions', icon: FileText },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Forms', url: '/forms', icon: ClipboardList },
  { title: 'Pricing', url: '/pricing', icon: DollarSign },
];

export function AdminSidebar() {
  const { signOut, user } = useAuth();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="!bg-sidebar !border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          {!collapsed ? (
            <img src={shinyPathLogo} alt="Shiny Path" className="h-8 brightness-0 invert" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} className="min-h-[44px]">
                      <NavLink
                        to={item.url}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-3 text-white/90 hover:text-white hover:bg-white/10 py-3",
                          isActive && "bg-white/20 text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-sans">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && user?.email && (
          <div className="mb-4 px-2">
            <p className="text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Signed in as</p>
            <p className="text-sm text-white/90 font-sans truncate" title={user.email}>{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/90 hover:text-white hover:bg-white/10 min-h-[44px] py-3"
          onClick={async () => {
            await signOut();
            navigate('/jhosso');
          }}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-sans">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
