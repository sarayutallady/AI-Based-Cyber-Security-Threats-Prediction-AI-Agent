import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Home, Map, Database, Activity, Network, Brain, FileText, Search, Settings, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      label: 'Go to Overview',
      icon: Home,
      action: () => navigate('/'),
      category: 'Navigation',
    },
    {
      id: 'nav-map',
      label: 'Go to Global Threat Map',
      icon: Map,
      action: () => navigate('/threat-map'),
      category: 'Navigation',
    },
    {
      id: 'nav-static',
      label: 'Go to Static Data Dashboard',
      icon: Database,
      action: () => navigate('/static-data'),
      category: 'Navigation',
    },
    {
      id: 'nav-streaming',
      label: 'Go to Streaming Data Dashboard',
      icon: Activity,
      action: () => navigate('/streaming-data'),
      category: 'Navigation',
    },
    {
      id: 'nav-network',
      label: 'Go to Network Dashboard',
      icon: Network,
      action: () => navigate('/network'),
      category: 'Navigation',
    },
    {
      id: 'nav-ml',
      label: 'Go to ML Dashboard',
      icon: Brain,
      action: () => navigate('/ml-dashboard'),
      category: 'Navigation',
    },
    {
      id: 'nav-reports',
      label: 'Go to Threat Reports',
      icon: FileText,
      action: () => navigate('/reports'),
      category: 'Navigation',
    },
    // Actions
    {
      id: 'action-search',
      label: 'Search Threats',
      icon: Search,
      action: () => toast.info('Search feature coming soon!'),
      category: 'Actions',
    },
    {
      id: 'action-theme',
      label: 'Toggle Theme',
      icon: Moon,
      action: () => {
        document.documentElement.classList.toggle('dark');
        toast.success('Theme toggled!');
      },
      category: 'Actions',
    },
    {
      id: 'action-settings',
      label: 'Open Settings',
      icon: Settings,
      action: () => toast.info('Settings panel coming soon!'),
      category: 'Actions',
    },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (item: CommandItem) => {
    setOpen(false);
    setSearch('');
    item.action();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <Command className="rounded-lg border-0 shadow-2xl">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            {['Navigation', 'Actions'].map((category) => (
              <Command.Group key={category} heading={category} className="mb-2">
                {commands
                  .filter((cmd) => cmd.category === category)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={item.label}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground transition-colors"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{item.label}</span>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            ))}
          </Command.List>
          <div className="border-t border-border p-2 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 inline-flex">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 inline-flex">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 inline-flex">
                ⌘K
              </kbd>
              <span>Toggle</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
