import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

export default function SyncCustomer() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      axios.post("http://localhost:5000/api/auth/sync", {
        clerkId: user.id,
        name: user.fullName,
        email: user.emailAddresses[0].emailAddress,
      });
    }
  }, [user]);

  return null;
}
