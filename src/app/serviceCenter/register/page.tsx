// page.js
'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from '../component/LoginForm';
import React from 'react';

export default function Home() {
    return (
        <div className="container">
            <div className="row justify-content-center 
                        align-items-center min-vh-100">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">
                        Service Center Registration
                    </h1>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
