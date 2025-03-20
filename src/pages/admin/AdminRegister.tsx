import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Here you would typically make an API call to register the user
    // For demo purposes, we'll just simulate a successful registration
    localStorage.setItem('adminIsLoggedIn', 'true');
    toast({
      title: "Registration successful",
      description: "Welcome to the admin panel",
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Registration</h1>
          <p className="text-muted-foreground mt-2">Create a new admin account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all hover:bg-primary/90"
          >
            Register
          </button>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister; 