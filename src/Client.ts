import { APIClient } from "@brigadecore/brigade-sdk"

import * as consts from "./Consts"
import config from "./config.json"

export default function getClient(): APIClient {
  const token = localStorage.getItem(consts.brigadeAPITokenKey) || ""
  return new APIClient(config.apiAddress, token)
}
