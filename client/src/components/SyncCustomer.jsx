import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

export default function SyncCustomer() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:5000/api/auth/sync", {
          clerkId: user.id,
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          phone: user.primaryPhoneNumber?.phoneNumber,
        })
        .then((res) => {
          if (res.data?.customer?._id) {
            localStorage.setItem("customerId", res.data.customer._id);
          }
        })
        .catch((err) => {
          console.error("Sync customer failed:", err);
        });
    }
  }, [user]);

  return null;
}
