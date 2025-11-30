"use client";

import axios from "axios";
import type { FullAddrGeoRequest, FullAddrGeoResponse } from "./types";

const _httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMAP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const tmapCommonParams = {
  version: 1,
  appKey: process.env.NEXT_PUBLIC_TMAP_APP_KEY ?? "",
} as const;

const findAddressByText = async (addressText: string) => {
  const request: FullAddrGeoRequest = {
    ...tmapCommonParams,
    fullAddr: addressText,
  };

  const response = await _httpClient.get<FullAddrGeoResponse>(
    "/tmap/geo/fullAddrGeo",
    {
      params: request,
    },
  );
  return response.data?.coordinateInfo;
};

const tmapService = { findAddressByText };
export default tmapService;
