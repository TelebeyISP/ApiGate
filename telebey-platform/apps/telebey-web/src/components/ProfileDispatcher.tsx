import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MyAccount } from "@/pages/MyAccount";
import { PublicProfile } from "@/pages/PublicProfile";

export function ProfileDispatcher() {
  const { username } = useParams<{ username: string }>();
  const { user, isAuthenticated } = useAuth();

  // If viewing a specific username
  if (username) {
    // Case-insensitive check for ownership
    if (isAuthenticated && user?.username?.toLowerCase() === username.toLowerCase()) {
      return <MyAccount />;
    }
    // Otherwise, show public profile (handles search results, community clicks, etc.)
    return <PublicProfile />;
  }

  // If at /account without a username, it's the private dashboard for the current user
  return <MyAccount />;
}
