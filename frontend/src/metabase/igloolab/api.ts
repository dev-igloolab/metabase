import { Api } from "metabase/api/api";
import { idTag, invalidateTags, listTag } from "metabase/api/tags";
import type { UserId } from "metabase-types/api";

import type {
  UserInterface,
  UserInterfaceAssignment,
  UserInterfaceResponse,
} from "./types";

export const igloolabPortalApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUserInterface: builder.query<UserInterfaceResponse, void>({
      query: () => "/api/igloolab/portal/current",
    }),
    getUserInterfaceAssignments: builder.query<UserInterfaceAssignment[], void>(
      {
        query: () => "/api/igloolab/portal/assignments",
        providesTags: [listTag("user")],
      },
    ),
    updateUserInterface: builder.mutation<
      UserInterfaceResponse,
      { userId: UserId; interfaceType: UserInterface }
    >({
      query: ({ userId, interfaceType }) => ({
        method: "PUT",
        url: `/api/igloolab/portal/user/${userId}`,
        body: { interface_type: interfaceType },
      }),
      invalidatesTags: (_, error, { userId }) =>
        invalidateTags(error, [idTag("user", userId), listTag("user")]),
    }),
  }),
});

export const {
  useGetCurrentUserInterfaceQuery,
  useGetUserInterfaceAssignmentsQuery,
  useUpdateUserInterfaceMutation,
} = igloolabPortalApi;
