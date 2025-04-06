'use client';

import { useState, useEffect } from 'react';
import type { UserDetails } from '../auth/types/user/user-details.interface';
import Image from 'next/image';
import { IdCardIcon } from 'lucide-react';
import axiosInstance from 'axios';


// Extract user profile section into a separate component
const UserProfile = ({ user }: { user: UserDetails }) => (
  <div className="d-flex align-items-center gap-3 mb-4">
    <div>
      <h2 className="h5 mb-1">{user.name}</h2>
      <p className="text-muted mb-0">{user.email}</p>
    </div>
  </div>
);


// Extract dialog content into a separate component
const DialogContentSection = ({
  isLoading,
  error,
  user,
}: {
  isLoading: boolean;
  error: string | null;
  user: UserDetails | null;
}) => {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  if (!user?.name) {
    return (
      <div className="text-muted py-3 text-center">
        No user data available
      </div>
    );
  }

  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
};

export default function UserDetailsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/auth/user');
      const userData = response.data.data;
      setUser({
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      console.error('Error fetching user details', error);
      setError('Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserDetails();
    }
  }, [isOpen]);

  return (
    <>
      <button 
        className="btn btn-outline-primary d-flex align-items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <IdCardIcon className="bi bi-person-badge" style={{ width: '1em', height: '1em' }} />
        View Details
      </button>

      {isOpen && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <DialogContentSection isLoading={isLoading} error={error} user={user} />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}