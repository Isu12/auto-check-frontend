// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../auth/ui/card"
// import "react-toastify/dist/ReactToastify.css";
// import { StationInfoInterface } from "./Types/ServiceStation.Interface";
// import { useAuthToken } from "@/app/auth/hooks/accessHook";
// import { fetchServiceStationById } from "../services/api";


// interface ViewStationModalProps {
//   recordId: string;
//   onClose: () => void;
// }

// const StationInfoCardView = ({ recordId, onClose }: ViewStationModalProps) => {
//   const [stationData, setStationData] = useState<StationInfoInterface | null>(
//     null
//   );
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const accessToken = useAuthToken();


//   useEffect(() => {
//     const fetchUserStation = async () => {
//       try {
//         if (!accessToken) throw new Error("No access token found");
  
//         const data = await fetchServiceStationById(recordId,accessToken);
//         setStationData(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchUserStation();
//   }, [accessToken]);
//   // Dependency on accessToken to re-fetch when token changes
  
//   if (loading)
//     return <div className="p-4">Loading your station details...</div>;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//   if (!stationData) return <div className="p-4">No station data found</div>;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">My Service Station</h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 Business Registration No
//               </p>
//               <p>{stationData.businessRegNo}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Business Name</p>
//               <p>{stationData.businessName}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Branch</p>
//               <p>{stationData.branch}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Business Type</p>
//               <p>{stationData.businessType}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Location Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Location Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-muted-foreground">Address</p>
//               <p>{stationData.address}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">City</p>
//               <p>{stationData.city}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Postal Code</p>
//               <p>{stationData.postalCode}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Contact Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Contact Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-muted-foreground">Email</p>
//               <p>{stationData.email}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Phone Numbers</p>
//               <p>{stationData.phoneNumber1}</p>
//               {stationData.phoneNumber2 && <p>{stationData.phoneNumber2}</p>}
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Website</p>
//               <p>{stationData.webUrl || "N/A"}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Owner Information Card */}
//         <Card className="md:col-span-2 lg:col-span-3">
//           <CardHeader>
//             <CardTitle>Owner Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Owner Name</p>
//                 <p>{stationData.ownerName}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Contact Number</p>
//                 <p>{stationData.contactNumber}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Alternate Email</p>
//                 <p>{stationData.email2 || "N/A"}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//     </div>
//   );
// };

// export default StationInfoCardView;
