import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Kanban, Menu, X, LogOut, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    ethereum?: unknown;
    solana?: unknown;
  }
}

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [solAddress, setSolAddress] = useState<string | null>(null);
  const [walletDropdown, setWalletDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      const randomId = Math.floor(Math.random() * 1000);
      fetch(`https://picsum.photos/id/${randomId}/info`)
        .then(res => res.json())
        .then(data => setAvatarUrl(data.download_url))
        .catch(() => setAvatarUrl(null));
    }
  }, [user]);

  const navigation = [
    { name: 'Task Board', href: '/', icon: Kanban },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged out', description: 'You have been signed out successfully.' });
    navigate('/login', { replace: true });
  };

  const connectMetaMask = async () => {
    type Ethereum = { request: (args: { method: string }) => Promise<string[]> };
    const eth = window.ethereum as Ethereum | undefined;
    if (eth) {
      try {
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        setEthAddress(accounts[0]);
        setWalletDropdown(false);
        toast({ title: 'MetaMask Connected', description: accounts[0] });
      } catch (err) {
        toast({ title: 'MetaMask Error', description: (err as Error).message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'MetaMask Not Found', description: 'Please install MetaMask extension.', variant: 'destructive' });
    }
  };

  const connectPhantom = async () => {
    type Phantom = { isPhantom?: boolean; connect?: () => Promise<{ publicKey: { toString: () => string } }> };
    const sol = window.solana as Phantom | undefined;
    if (sol && sol.isPhantom && sol.connect) {
      try {
        const resp = await sol.connect();
        setSolAddress(resp.publicKey.toString());
        setWalletDropdown(false);
        toast({ title: 'Phantom Connected', description: resp.publicKey.toString() });
      } catch (err) {
        toast({ title: 'Phantom Error', description: (err as Error).message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Phantom Not Found', description: 'Please install Phantom Wallet.', variant: 'destructive' });
    }
  };

  const disconnectWallet = () => {
    setEthAddress(null);
    setSolAddress(null);
    setWalletDropdown(false);
    toast({ title: 'Wallet Disconnected' });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({ title: 'Address Copied', description: address });
  };

  const truncate = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#111111]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gradient">
              Donezo
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Wallet Connect Buttons */}
            <div className="flex items-center gap-2 ml-4 relative">
              {/* If not connected, show connect buttons */}
              {!ethAddress && !solAddress && (
                <>
                  <Button variant="outline" size="sm" onClick={connectMetaMask} className="bg-[#23272f] text-yellow-400 border-yellow-400 hover:bg-yellow-400/10">
                    Connect MetaMask
                  </Button>
                  <Button variant="outline" size="sm" onClick={connectPhantom} className="bg-[#23272f] text-purple-400 border-purple-400 hover:bg-purple-400/10">
                    Connect Phantom
                  </Button>
                </>
              )}
              {/* If connected, show address and dropdown */}
              {(ethAddress || solAddress) && (
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setWalletDropdown((v) => !v)} className="bg-[#23272f] text-green-400 border-green-400 hover:bg-green-400/10">
                    {ethAddress ? (
                      <span>ETH: {truncate(ethAddress)}</span>
                    ) : (
                      <span>SOL: {truncate(solAddress!)}</span>
                    )}
                  </Button>
                  {walletDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#18181b] border border-white/10 rounded-xl shadow-lg p-4 z-50 animate-fade">
                      <div className="flex flex-col items-start gap-2">
                        {ethAddress && (
                          <>
                            <div className="text-white text-xs mb-1">MetaMask Connected</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{truncate(ethAddress)}</span>
                              <Button variant="ghost" size="icon" onClick={() => copyAddress(ethAddress)}><Copy className="w-4 h-4" /></Button>
                            </div>
                          </>
                        )}
                        {solAddress && (
                          <>
                            <div className="text-white text-xs mb-1">Phantom Connected</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{truncate(solAddress)}</span>
                              <Button variant="ghost" size="icon" onClick={() => copyAddress(solAddress)}><Copy className="w-4 h-4" /></Button>
                            </div>
                          </>
                        )}
                        <Button onClick={disconnectWallet} className="mt-2 w-full" variant="destructive">Disconnect</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/60 md:hidden animate-fade"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide-in mobile menu */}
            <div className="fixed top-0 left-0 right-0 z-50 md:hidden border-t border-[#1a1a1a] bg-[#111111] animate-slide-in-down shadow-lg">
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                      isActive(item.href)
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
