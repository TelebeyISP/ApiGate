
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, LogOut, Bell, Search, 
  Shield, Key, Mail, Lock, FileCode, Database, Layout, 
  RefreshCw, HelpCircle, Users, BarChart, AlertTriangle 
} from 'lucide-react';
import VerificatieLogo from '@/auth/components/verificatie-logo';
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <VerificatieLogo size="sm" />
            </div>
            
            <div className="flex-1 max-w-xl mx-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-verificatie-500 focus:border-verificatie-500 sm:text-sm"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-verificatie-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verificatie-500 verificatie-transition">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-verificatie-200 flex items-center justify-center text-verificatie-800 font-medium">
                    JD
                  </div>
                  <div className="hidden md:block text-sm font-medium text-gray-700">John Doe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <nav className="hidden md:block w-64 bg-white shadow-md">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium px-3">Applications</h3>
                  <div className="space-y-1">
                    <Link to="/dashboard" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-verificatie-50 text-verificatie-700">
                      <Layout className="text-verificatie-500 mr-3 h-5 w-5" />
                      <span className="truncate">Overview</span>
                    </Link>
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <Key className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">API Keys</span>
                    </Link>
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <Users className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Users</span>
                    </Link>
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <Shield className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Roles & Permissions</span>
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium px-3">Integration</h3>
                  <div className="space-y-1">
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <FileCode className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">API Reference</span>
                    </Link>
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <Database className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Webhooks</span>
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium px-3">Account</h3>
                  <div className="space-y-1">
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <User className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Profile</span>
                    </Link>
                    <Link to="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <Settings className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Settings</span>
                    </Link>
                    <Link to="/login" onClick={handleLogout} className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-verificatie-700 hover:bg-gray-50 verificatie-transition">
                      <LogOut className="text-gray-400 group-hover:text-verificatie-500 mr-3 h-5 w-5 verificatie-transition" />
                      <span className="truncate">Logout</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-verificatie-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      Check our <a href="#" className="text-verificatie-600 hover:text-verificatie-800">documentation</a> or <a href="#" className="text-verificatie-600 hover:text-verificatie-800">contact support</a>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Page header */}
          <div className="bg-white shadow-sm">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="flex space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verificatie-500 verificatie-transition">
                    View API docs
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verificatie-600 hover:bg-verificatie-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verificatie-500 verificatie-transition">
                    Create API Key
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-verificatie-100 rounded-md p-3">
                      <Users className="h-6 w-6 text-verificatie-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">2,651</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Increased by</span>
                            12%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-verificatie-600 hover:text-verificatie-800">View all users</a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-verificatie-100 rounded-md p-3">
                      <Key className="h-6 w-6 text-verificatie-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">API Requests (24h)</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">35,641</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Increased by</span>
                            8.4%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-verificatie-600 hover:text-verificatie-800">View API metrics</a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-verificatie-100 rounded-md p-3">
                      <AlertTriangle className="h-6 w-6 text-verificatie-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Security Events</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">3</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Increased by</span>
                            2
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-verificatie-600 hover:text-verificatie-800">View security log</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-verificatie-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-verificatie-600" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-verificatie-600 truncate">User Authentication</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Success
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          john.doe@example.com
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Just now
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-verificatie-100 p-2 rounded-full">
                          <Key className="h-5 w-5 text-verificatie-600" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-verificatie-600 truncate">API Key Created</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Success
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Key ID: VER_4f3ed9a8...
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-verificatie-100 p-2 rounded-full">
                          <RefreshCw className="h-5 w-5 text-verificatie-600" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-verificatie-600 truncate">Token Refresh</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Success
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          session-9d6a3c21
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-verificatie-100 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-verificatie-600" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-verificatie-600 truncate">Failed Login Attempt</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Failed
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          IP: 192.168.1.1
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          5 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* API documentation */}
          <div className="px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Integration</h2>
            <div className="bg-white shadow sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Start</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Integrate Verificatie authentication into your application with just a few lines of code.</p>
                </div>
                <div className="mt-5">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="text-sm font-mono text-gray-800">
                      <div className="mb-2 text-gray-500">// Install SDK</div>
                      <div className="text-verificatie-800">npm install verificatie-sdk</div>
                      
                      <div className="mb-2 mt-4 text-gray-500">// Initialize</div>
                      <div className="text-verificatie-800">
                        {`import { Verificatie } from 'verificatie-sdk';`}<br />
                        <br />
                        {`const verificatie = new Verificatie({`}<br />
                        {`  apiKey: 'YOUR_API_KEY',`}<br />
                        {`  domain: 'verificatie.nl'`}<br />
                        {`});`}
                      </div>
                      
                      <div className="mb-2 mt-4 text-gray-500">// Authenticate a user</div>
                      <div className="text-verificatie-800">
                        {`const token = await verificatie.authenticate({`}<br />
                        {`  email: 'user@example.com',`}<br />
                        {`  password: 'user-password'`}<br />
                        {`});`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">SDK Downloads</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Choose the SDK for your technology stack.</p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-verificatie-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-verificatie-500">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-verificatie-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-verificatie-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.103,10.43793a1.78593,1.78593,0,1,0,2.43957.65362A1.786,1.786,0,0,0,11.103,10.43793Zm6.43061,7.68176L9.09558,23.674a2.0136,2.0136,0,0,1-1.97763,0L1.86493,20.74208a2.04875,2.04875,0,0,1-1.01174-1.75976V8.25015A2.04677,2.04677,0,0,1,1.86493,6.491L7.11795,3.5582a2.0136,2.0136,0,0,1,1.97763,0L12.897,6.07013,9.78634,7.82838a3.22631,3.22631,0,0,0-.20237,5.89065l9.38458,5.41333a.229.229,0,0,0,.32977-.12095A.22969.22969,0,0,0,19.43586,18.84328Zm3.68549-1.02932-9.38202-5.4133a.227.227,0,0,0-.331.1143.22184.22184,0,0,0-.023.1057.22689.22689,0,0,0,.10968.17952l9.394,5.42347a.21242.21242,0,0,0,.21234.023.22689.22689,0,0,0,.10968-.17952v-.9073A.21625.21625,0,0,0,23.10113,17.78761Zm0-2.421-9.38168-5.413a.22706.22706,0,0,0-.33133.11431.22184.22184,0,0,0-.023.1057.22683.22683,0,0,0,.10968.17952l9.38391,5.42347a.21257.21257,0,0,0,.21234.023.22683.22683,0,0,0,.10968-.17952v-.9073A.21625.21625,0,0,0,23.10113,15.36665Zm0-2.427-9.38168-5.41333a.22675.22675,0,0,0-.33133.11431c-.00448.01919-.00747.03857-.01007.05798a.23.23,0,0,0,.0968.19351l9.38394,5.41334a.21384.21384,0,0,0,.21881.01525.22659.22659,0,0,0,.10321-.17952v-.9073A.21261.21261,0,0,0,23.10113,12.93968Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        <p className="text-sm font-medium text-gray-900">
                          React SDK
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          v1.3.5 - Latest
                        </p>
                      </a>
                    </div>
                  </div>

                  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-verificatie-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-verificatie-500">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-verificatie-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-verificatie-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.8331,9.33894l1.76674-1.638c.17774-.17772.16791-.48636-.01967-.65428L17.428,5.20147a.47449.47449,0,0,0-.65428-.01967L15.1355,6.839l2.6976,2.49993ZM4.76141,17.7466,14.5177,8.89247,12.1396,6.51431,2.38332,15.36836a.47512.47512,0,0,0-.12765.211L1.00016,22.2095a.47334.47334,0,0,0,.47336.57586.474.474,0,0,0,.10256-.0113l6.6301-1.25527a.47688.47688,0,0,0,.211-.12766l.47335-.47335L4.13831,17.1235l.6231-.6231Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        <p className="text-sm font-medium text-gray-900">
                          Vue.js SDK
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          v1.2.1 - Latest
                        </p>
                      </a>
                    </div>
                  </div>

                  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-verificatie-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-verificatie-500">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-verificatie-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-verificatie-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        <p className="text-sm font-medium text-gray-900">
                          PHP SDK
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          v1.1.0 - Latest
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
