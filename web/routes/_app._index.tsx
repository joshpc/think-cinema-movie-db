import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Card,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";

export default function Index() {
  return (
    <Page title="Think Cinema Movie Database">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200" inlineAlign="center">
              <Text variant="bodyMd" as="p" alignment="center">
                This is a placeholder. Here you'll be able to upload actors/cast/credits.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">All People</Text>
            <Card padding="0">
              {/* use Autocomponents to build UI quickly: https://docs.gadget.dev/guides/frontend/autocomponents  */}
              <AutoTable
                //@ts-ignore
                model={api.person}
                columns={["firstName", "middleName", "lastName", "birthYear"]}
              />
              <Box padding="400">
                <Text variant="bodyMd" as="p">
                  Shop records fetched from:{" "}
                  <Link
                    url={`/edit/model/DataModel-Shopify-Shop/data`}
                    target="_blank"
                    removeUnderline
                  >
                    api/models/shopifyShop/data
                  </Link>
                </Text>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
