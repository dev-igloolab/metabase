import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { replace } from "react-router-redux";
import { t } from "ttag";

import { AppBarRoot } from "metabase/nav/components/AppBar/AppBarLarge.styled";
import { useDispatch, useSelector } from "metabase/redux";
import { logout } from "metabase/redux/auth";
import { getUser } from "metabase/selectors/user";
import {
  Box,
  Button,
  Divider,
  Group,
  Icon,
  Menu,
  Stack,
  Text,
  useColorScheme,
} from "metabase/ui";

import { isPortalPath } from "./portal-utils";

export function PortalLayout({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const { colorScheme, setColorScheme } = useColorScheme();
  const allowed = isPortalPath(pathname);
  const userName = user?.common_name || user?.first_name || user?.email;

  useEffect(() => {
    if (!allowed) {
      dispatch(replace("/portal"));
    }
  }, [allowed, dispatch]);

  return (
    <Box
      h="100vh"
      style={{ display: "flex", flexDirection: "column", overflow: "auto" }}
    >
      <AppBarRoot hasSidebarOpen={false}>
        <Group gap="sm" flex="1 1 auto">
          {pathname !== "/portal" && (
            <Button component={Link} to="/portal" variant="subtle">
              {t`Volver a tus dashboards`}
            </Button>
          )}
        </Group>

        {user && (
          <Menu position="bottom-end" shadow="md" width={260} offset={8}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<Icon name="chevrondown" size={12} aria-hidden />}
              >
                {userName}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Stack gap={2} px="md" py="sm">
                <Text fw={600}>{userName}</Text>
                <Text size="sm" c="text-light">
                  {user.email}
                </Text>
              </Stack>
              <Divider />
              <Menu.Label>{t`Tema`}</Menu.Label>
              <Menu.Item
                rightSection={
                  colorScheme === "auto" ? (
                    <Icon name="check" size={14} aria-hidden />
                  ) : null
                }
                onClick={() => setColorScheme("auto")}
              >
                {t`Automático`}
              </Menu.Item>
              <Menu.Item
                rightSection={
                  colorScheme === "light" ? (
                    <Icon name="check" size={14} aria-hidden />
                  ) : null
                }
                onClick={() => setColorScheme("light")}
              >
                {t`Claro`}
              </Menu.Item>
              <Menu.Item
                rightSection={
                  colorScheme === "dark" ? (
                    <Icon name="check" size={14} aria-hidden />
                  ) : null
                }
                onClick={() => setColorScheme("dark")}
              >
                {t`Oscuro`}
              </Menu.Item>
              <Divider />
              <Menu.Item
                leftSection={<Icon name="exit" size={16} aria-hidden />}
                onClick={() => dispatch(logout())}
              >
                {t`Cerrar sesión`}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </AppBarRoot>

      <Box style={{ flex: 1, minHeight: 0 }}>{allowed ? children : null}</Box>
    </Box>
  );
}
