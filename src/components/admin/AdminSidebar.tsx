import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  DollarSign, 
  Settings,
  LogOut,
  ClipboardList
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
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Submissions', url: '/admin/submissions', icon: FileText },
  { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
  { title: 'Forms', url: '/admin/forms', icon: ClipboardList },
  { title: 'Pricing', url: '/admin/pricing', icon: DollarSign },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

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
                  (item.url !== '/admin' && location.pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-3 text-white/90 hover:text-white hover:bg-white/10",
                          isActive && "bg-white/20 text-white"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
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
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-white/90 hover:text-white hover:bg-white/10" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="font-sans">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
