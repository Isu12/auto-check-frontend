"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../../../Components/ConfirmationDialog";
import EditModal from "./EditModal";
import { StationInfoInterface } from "./Types/ServiceStation.Interface";

const StationInfoCardView = () => {
  const [stationData, setStationData] = useState<StationInfoInterface | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserStation = async () => {
      try {
        // Replace with your actual API endpoint to get logged-in user's station
        const response = await fetch(
          "http://localhost:5555/api/stations/my-station",
          {
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch station data");
        }

        const data = await response.json();
        setStationData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStation();
  }, []);

  const handleDelete = async () => {
    if (!stationData?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5555/api/stations/${stationData._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service station");
      }

      setStationData(null);
      toast.success("Service Station Deleted");
    } catch (error) {
      toast.error("Error deleting station: " + error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleSaveEditedRecord = async (
    updatedRecord: StationInfoInterface
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stations/${updatedRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedRecord),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the service station");
      }

      const updatedData = await response.json();
      setStationData(updatedData);
      toast.success("Service station updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Error updating service station: ${error.message}`);
    }
  };

  if (loading)
    return <div className="p-4">Loading your station details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!stationData) return <div className="p-4">No station data found</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Service Station</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Business Registration No
              </p>
              <p>{stationData.businessRegNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Business Name</p>
              <p>{stationData.businessName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p>{stationData.branch}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Business Type</p>
              <p>{stationData.businessType}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{stationData.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p>{stationData.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Postal Code</p>
              <p>{stationData.postalCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{stationData.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Numbers</p>
              <p>{stationData.phoneNumber1}</p>
              {stationData.phoneNumber2 && <p>{stationData.phoneNumber2}</p>}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <p>{stationData.webUrl || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Owner Information Card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Owner Name</p>
                <p>{stationData.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p>{stationData.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alternate Email</p>
                <p>{stationData.email2 || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete your service station? This action cannot be undone."
        title="Delete Confirmation"
      />

      {isEditModalOpen && stationData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={stationData}
          onSave={handleSaveEditedRecord}
        />
      )}
    </div>
  );
};

export default StationInfoCardView;
