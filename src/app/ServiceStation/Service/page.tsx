"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceStationForm from "../Component/ServiceStationForm";
import React, { useEffect, useState } from 'react';


export default function Home() {
  return (

    <div style={{ display: 'flex' }}>
      {/* sidebar here */}
      {/* <main style={{ marginLeft: '250px' }}> */}
        <div className="container">
          <div className="row justify-content-center 
                        align-items-center min-vh-100">
            <div className="col-md-7">
              <h2 className="text-center mb-4">
                Add Service Station
              </h2>
              <ServiceStationForm />
            </div>
          </div>
        </div>
      {/* </main> */}
    </div>
  )
}