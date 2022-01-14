import { APIClient } from "@brigadecore/brigade-sdk"

import * as consts from "./Consts"
import * as config from "./Config"

export default function getClient(): APIClient {
  const token = localStorage.getItem(consts.brigadeAPITokenKey) || ""
  return new APIClient(config.apiAddress, token)
}
