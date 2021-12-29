import { APIClient } from "@brigadecore/brigade-sdk"

import * as config from "./Config"

export default function getClient(): APIClient {
  const token = localStorage.getItem(config.brigadeAPITokenKey) || ""
  return new APIClient(config.apiAddress, token)
}
