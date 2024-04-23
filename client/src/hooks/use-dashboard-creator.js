import { getUserFromName } from "@/app/api/users/user";
import { useEffect, useState } from "react";

export const useDashboardCreator = (params) => {
  const [externalUser, setExternalUser] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    const _getUser = async () => {
      try {
        const _externalUser = JSON.parse(localStorage.getItem("user"));
        setExternalUser(_externalUser);
        const _user = await getUserFromName({
          userName: params.username,
        });
        setUser(_user);
      } catch (e) {
        console.log(e);
      }
    };

    _getUser();
  }, [params]);

  return {
    user,
    externalUser,
  };
};
