import { Link } from "react-router";
import { t } from "ttag";

import { useSearchQuery } from "metabase/api";
import {
  Box,
  Button,
  Card,
  Group,
  Icon,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "metabase/ui";

const DASHBOARD_LIMIT = 200;

export function PortalPage() {
  const { data, isFetching, error, refetch } = useSearchQuery({
    models: ["dashboard"],
    archived: false,
    q: "",
    context: "search-app",
    limit: DASHBOARD_LIMIT,
    offset: 0,
  });

  return (
    <Box maw={1200} mx="auto" p="xl">
      <Stack gap="xl">
        <Title order={1}>{t`Tus dashboards`}</Title>

        {error ? (
          <Stack align="center">
            <Text>{t`No pudimos cargar los dashboards.`}</Text>
            <Button onClick={() => refetch()}>{t`Reintentar`}</Button>
          </Stack>
        ) : isFetching ? (
          <Group justify="center">
            <Loader aria-label={t`Cargando dashboards`} />
          </Group>
        ) : !data?.data.length ? (
          <Text c="text-light">
            {t`Todavía no tienes dashboards disponibles. Contacta al administrador para revisar tu acceso.`}
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {data.data.map((dashboard) => (
              <Card
                key={dashboard.id}
                withBorder
                padding="lg"
                component={Link}
                to={`/dashboard/${dashboard.id}`}
                style={{ textDecoration: "none" }}
              >
                <Stack gap="md" h="100%">
                  <Icon name="dashboard" c="brand" size={24} aria-hidden />
                  <Title order={3}>{dashboard.name}</Title>
                  {dashboard.description && (
                    <Text c="text-light" lineClamp={3}>
                      {dashboard.description}
                    </Text>
                  )}
                  <Group gap="xs" mt="auto" c="brand">
                    <Text c="brand" fw={600}>
                      {t`Ver dashboard`}
                    </Text>
                    <Icon name="chevronright" size={14} aria-hidden />
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Box>
  );
}
