import { useMemo, useState } from "react";
import { t } from "ttag";

import { useListUsersQuery } from "metabase/api";
import { LoadingAndErrorWrapper } from "metabase/common/components/LoadingAndErrorWrapper";
import { UserAvatar } from "metabase/common/components/UserAvatar";
import { useToast } from "metabase/common/hooks";
import { Box, Card, Group, Select, Stack, Text, Title } from "metabase/ui";

import {
  useGetUserInterfaceAssignmentsQuery,
  useUpdateUserInterfaceMutation,
} from "./api";
import type { UserInterface } from "./types";

export function PortalUsersPage() {
  const [pending, setPending] = useState<Record<number, UserInterface>>({});
  const [sendToast] = useToast();
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useListUsersQuery({ tenancy: "internal" });
  const {
    data: assignments = [],
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
  } = useGetUserInterfaceAssignmentsQuery();
  const [updateInterface] = useUpdateUserInterfaceMutation();
  const interfaceOptions = useMemo(
    () => [
      { value: "metabase", label: t`Aplicación completa` },
      { value: "portal", label: t`Portal de dashboards` },
    ],
    [],
  );

  const users = useMemo(
    () => (usersData?.data ?? []).filter((user) => !user.is_superuser),
    [usersData],
  );
  const assignmentsByUserId = useMemo(
    () =>
      new Map(
        assignments.map(({ user_id, interface_type }) => [
          user_id,
          interface_type,
        ]),
      ),
    [assignments],
  );

  const handleChange = async (userId: number, interfaceType: string | null) => {
    if (interfaceType !== "metabase" && interfaceType !== "portal") {
      return;
    }

    setPending((values) => ({ ...values, [userId]: interfaceType }));
    try {
      await updateInterface({ userId, interfaceType }).unwrap();
      sendToast({ message: t`Interfaz actualizada`, icon: "check" });
    } catch {
      sendToast({
        message: t`No se pudo actualizar la interfaz`,
        icon: "warning",
      });
    } finally {
      setPending((values) => {
        const nextValues = { ...values };
        delete nextValues[userId];
        return nextValues;
      });
    }
  };

  return (
    <Stack gap="lg">
      <Box>
        <Title order={1}>{t`Portal de usuarios`}</Title>
        <Text c="text-secondary" mt="xs">
          {t`Define qué usuarios ingresan al portal simplificado. Los permisos de las colecciones siguen controlando qué dashboards puede ver cada persona.`}
        </Text>
      </Box>

      <Card p={0} withBorder>
        <LoadingAndErrorWrapper
          loading={isUsersLoading || isAssignmentsLoading}
          error={usersError ?? assignmentsError}
        >
          <Box
            component="table"
            w="100%"
            style={{ borderCollapse: "collapse" }}
            data-testid="igloolab-portal-users-table"
          >
            <thead>
              <tr>
                <Box component="th" p="md" ta="left">
                  {t`Usuario`}
                </Box>
                <Box component="th" p="md" ta="left">
                  {t`Correo`}
                </Box>
                <Box component="th" p="md" ta="left">
                  {t`Interfaz`}
                </Box>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Box component="td" p="md">
                    <Group gap="sm" wrap="nowrap">
                      <UserAvatar user={user} />
                      <Text fw={700}>{user.common_name}</Text>
                    </Group>
                  </Box>
                  <Box component="td" p="md">
                    {user.email}
                  </Box>
                  <Box component="td" p="md" w="18rem">
                    <Select
                      aria-label={t`Interfaz para ${user.common_name}`}
                      data={interfaceOptions}
                      value={
                        pending[user.id] ??
                        assignmentsByUserId.get(user.id) ??
                        "metabase"
                      }
                      onChange={(value) => handleChange(user.id, value)}
                      allowDeselect={false}
                    />
                  </Box>
                </tr>
              ))}
            </tbody>
          </Box>

          {users.length === 0 && (
            <Text c="text-secondary" ta="center" p="xl">
              {t`No hay usuarios disponibles para configurar.`}
            </Text>
          )}
        </LoadingAndErrorWrapper>
      </Card>
    </Stack>
  );
}
