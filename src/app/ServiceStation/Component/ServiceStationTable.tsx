import React from 'react';
import { UserDetails } from '../../auth/types/user/user-details.interface';
import { fetchUser } from '../services/api';
import { EyeIcon, MapPin, Globe, Phone, FileText, Building, Search, Filter, X } from 'lucide-react';

const UserCardsDisplay: React.FC = () => {
  const [users, setUsers] = React.useState<UserDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<UserDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage] = React.useState(9);
  const [expandedUserId, setExpandedUserId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    businessType: '',
    city: '',
    hasBranches: false,
    hasWebsite: false,
  });
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUser();
        if (Array.isArray(response)) {
          setUsers(response);
          setFilteredUsers(response);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Extract unique business types, cities, and roles for filter options
  const businessTypes = Array.from(new Set(
    users
      .map(user => user.business?.type)
      .filter(Boolean) as string[]
  )).sort();

  const cities = Array.from(new Set(
    users
      .flatMap(user => 
        user.business?.branches?.map(branch => branch.city) || []
      )
      .filter(Boolean) as string[]
  )).sort();

  const roles = Array.from(new Set(
    users.map(user => user.role).filter(Boolean) as string[]
  )).sort();

  // Apply search and filters whenever they change
  React.useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.business?.name?.toLowerCase().includes(term) ?? false) ||
        (user.business?.type?.toLowerCase().includes(term) ?? false) ||
        (user.business?.branches?.some(branch => 
          branch.name.toLowerCase().includes(term) ?? false)
        )
      );
    }
    
    // Apply filters
    if (filters.businessType) {
      result = result.filter(user => 
        user.business?.type?.toLowerCase() === filters.businessType.toLowerCase()
      );
    }
    
    if (filters.city) {
      result = result.filter(user => 
        user.business?.branches?.some(branch => 
          branch.city?.toLowerCase() === filters.city.toLowerCase()
        )
      );
    }
    
    if (filters.hasBranches) {
      result = result.filter(user => 
        user.business?.branches && user.business.branches.length > 0
      );
    }
    
    if (filters.hasWebsite) {
      result = result.filter(user => 
        user.business?.website && user.business.website.trim() !== ''
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, filters]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const toggleUserExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      businessType: '',
      city: '',
      hasBranches: false,
      hasWebsite: false,
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-gray-600">Loading businesses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <p className="text-gray-600 mt-1">Please try again later</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-700 text-lg font-medium">No businesses found</p>
        <p className="text-gray-500">Register your business to get started</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Registered Businesses</h1>
        <p className="text-lg text-gray-600">Discover and find the best place to get your service done!</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search businesses by name, email, type..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filter Businesses</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset all filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={filters.businessType}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="hasBranches"
                    name="hasBranches"
                    type="checkbox"
                    checked={filters.hasBranches}
                    onChange={handleFilterChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <label htmlFor="hasBranches" className="ml-2 block text-sm text-gray-700">
                  Has Branches
                </label>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="hasWebsite"
                    name="hasWebsite"
                    type="checkbox"
                    checked={filters.hasWebsite}
                    onChange={handleFilterChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <label htmlFor="hasWebsite" className="ml-2 block text-sm text-gray-700">
                  Has Website
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="text-sm text-gray-500 mb-2">
          Showing {filteredUsers.length} of {users.length} businesses
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button 
              onClick={resetFilters}
              className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Clear filters
              <X className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-600 mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No businesses found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentUsers.map((user) => (
              <UserCard 
                key={user._id} 
                user={user} 
                isExpanded={expandedUserId === user._id}
                onToggleExpand={() => toggleUserExpand(user._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === i + 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const UserCard: React.FC<{ 
  user: UserDetails, 
  isExpanded: boolean,
  onToggleExpand: () => void 
}> = ({ user, isExpanded, onToggleExpand }) => {
  // Consistent blue color scheme for all cards
  const cardColor = 'bg-blue-50';
  const textColor = 'text-blue-600';

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Header with blue accent */}
      <div className={`${cardColor} px-6 py-4`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button 
            onClick={onToggleExpand}
            className={`p-2 rounded-full ${isExpanded ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Basic details */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
              <Building className={`h-4 w-4 ${textColor}`} />
            </span>
            <div>
              <p className="text-sm text-gray-500">Business</p>
              <p className="font-medium">{user.business?.name || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && user.business && (
          <div className="mt-6 space-y-5">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                  <FileText className={`h-4 w-4 ${textColor}`} />
                </span>
                Business Details
              </h3>
              
              <div className="space-y-3 pl-11">
                <div className="flex items-start">
                  <FileText className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="font-medium">{user.business.type || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">{user.business.registrationNumber || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{user.business.contactDetails || 'Not specified'}</p>
                  </div>
                </div>

                {user.business.website && (
                  <div className="flex items-start">
                    <Globe className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={user.business.website} 
                        className="font-medium text-blue-600 hover:underline break-all" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {user.business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {user.business?.branches && user.business.branches.length > 0 && (
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                    <MapPin className={`h-4 w-4 ${textColor}`} />
                  </span>
                  Branches ({user.business.branches.length})
                </h3>
                
                <div className="space-y-4 pl-11">
                  {user.business.branches.map((branch, index) => (
                    <div key={branch._id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-2">{branch.name}</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className={`h-4 w-4 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-sm font-medium">
                              {branch.address}, {branch.city}, {branch.postalCode}
                            </p>
                          </div>
                        </div>

                        {branch.contactDetails && (
                          <div className="flex items-start">
                            <Phone className={`h-4 w-4 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                            <div>
                              <p className="text-sm text-gray-500">Contact</p>
                              <p className="text-sm font-medium">{branch.contactDetails}</p>
                            </div>
                          </div>
                        )}

                        {branch.servicesOffered && branch.servicesOffered.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Services Offered</p>
                            <div className="flex flex-wrap gap-2">
                              {branch.servicesOffered.map((service, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-2 py-1 rounded-full ${cardColor} ${textColor} font-medium`}
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCardsDisplay;