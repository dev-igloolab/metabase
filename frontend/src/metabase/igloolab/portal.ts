import { useSelector } from "metabase/redux";
import { getUser } from "metabase/selectors/user";

import { useGetCurrentUserInterfaceQuery } from "./api";
import { usesUserPortal } from "./portal-utils";

export function useUserPortal() {
  const user = useSelector(getUser);
  const { data, isLoading } = useGetCurrentUserInterfaceQuery(undefined, {
    skip: !user,
  });

  return {
    isUserPortal: usesUserPortal(user, data?.interface_type),
    isLoading: Boolean(user && isLoading),
  };
}
