import { toast } from "sonner";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createToken } from "@/app/api/rooms/room";
import { useUserStore } from "@/store/user-user";

export const useViewerToken = (hostIdentity) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const { user } = useUserStore((state) => state);

  useEffect(() => {
    const _createToken = async () => {
      if (!user) {
        return;
      }
      try {
        const req = {
          hostId: hostIdentity,
          selfId: user._id,
          selfName: user.userName,
        };
        const viewerToken = await createToken(JSON.stringify(req));
        setToken(viewerToken.token);

        const decodedToken = jwtDecode(viewerToken.token);
        const decodedName = decodedToken.name;

        const decodedIdentity = decodedToken.jti;

        if (decodedIdentity) {
          setIdentity(decodedIdentity);
        }

        if (decodedName) {
          setName(decodedName);
        }
      } catch {
        toast.error("Something went wrong");
      }
    };

    _createToken();
  }, [hostIdentity, user]);

  return {
    token,
    name,
    identity,
  };
};
