export type UserInterface = "metabase" | "portal";

export type UserInterfaceResponse = {
  interface_type: UserInterface;
};

export type UserInterfaceAssignment = UserInterfaceResponse & {
  user_id: number;
};
