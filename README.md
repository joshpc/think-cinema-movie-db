# Think Cinema Movie Database

This is a database for the "Cast Graph": Movies -> People (either via a role as an Actor, or a Credit.)

## Setup

There are two Shopify applications that were created specifically for the Think Cinema Movies (think-cinema-movies.myshopify.com) store.

- [tc-movie-db](https://partners.shopify.com/4112402/apps/282044792833/overview) the production application (eee2a5f5fb67bf3cd056261d04b38fa1)
- [think-cinema-movie-actor-db](https://partners.shopify.com/4112402/apps/282051772417/overview) the development application (c61299d582805544b854c22043fce859)

On think-cinema-movies.myshopify.com currently both are installed but we'll use a test store for the development app soon enough.

- When updating the app proxy information (or shopify.app.toml), run the command `yarn shopify:deploy:production`

## How it ties together

1. We use an [Uploader](github.com/joshpc/think-cinema-movie-uploader) to import all of our data from a Collection.xml file exported from the owner's personal movie DB
2. Then, the app can query the database via the app proxy, defined in [shopify.app.toml](shopify.app.toml) (aka /cast/query) which is a proxy for the graphql endpoint.
3. This uses a reduced permissions user that can access the graph. **In the future this should be a fixed query, not an open-ended graph query.**
4. On the theme side, we link it all together by running the query in javascript:

```
<script src="https://tc-movie-db.gadget.app/api/client/web.min.js" defer="defer"></script>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize the Gadget API client with app proxy configuration
    window.thinkCinemaApi = new TcMovieDbClient({
      browserSession: {
        shopId: {{ shop.id }}
      },
      endpoint: "/apps/tcmoviedb"
    });
  });
```

```
let person = await window.thinkCinemaApi.person.maybeFindByHandle(personHandle, {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          handle: true,

          acting_roles: {
            edges: {
              node: {
                role: true,
                creditedAs: true,
                uncredited: true,
                voice: true,
                puppeteer: true,

                // Get the related movie information
                movie: {
                  id: true,
                  oldDatabaseId: true,

                  // Get the Shopify product details
                  product: {
                    title: true,
                    handle: true,
                    productionYear: true,
                    released: true,
                  }
                }
              }
            },
            pageInfo: {
              hasNextPage: true,
              endCursor: true
            }
          },

          credited_roles: {
            edges: {
              node: {
                type: true,
                subtype: true,
                creditedAs: true,

                // Get the related movie information
                movie: {
                  id: true,
                  oldDatabaseId: true,

                  // Get the Shopify product details
                  product: {
                    title: true,
                    handle: true,
                    productionYear: true,
                    released: true,
                  }
                }
              }
            },
            pageInfo: {
              hasNextPage: true,
              endCursor: true
            }
          }
        }
      });
```