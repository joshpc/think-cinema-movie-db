// make sure to replace "@gadget-client/unit-test-sample" with your Gadget API client!
import { TcMovieDbClient } from "@gadget-client/tc-movie-db";

export const api = new TcMovieDbClient({
  // The environment the test API client will connect to
  environment: "production",
  authenticationMode: {
    // an API client created using the GADGET_TEST_API_KEY environment variable
    apiKey: process.env["GADGET_TEST_API_KEY"]
  },
});
