/**
 * T map Full Text Geocoding API 요청(Request) 쿼리스트링 파라미터 타입
 * Resource URI: https://apis.openapi.sk.com/tmap/geo/fullAddrGeo
 */
export interface FullAddrGeoRequest {
  /**
   * 주소 정보입니다. (필수)
   * - 도로명 주소 표준 표기 방법을 지원
   * - UTF-8 기반 URL 인코딩 처리 필요
   * 예) 서울시 강남구 신사동 -> %EC%84%9C%EC%9A%B8%EC%8B%9C+%EA%B0%95%EB%82%A8%EA%B5%AC+%EC%8B%A0%EC%82%AC%EB%8F%99
   */
  fullAddr: string;

  /**
   * API 버전 정보입니다. (필수)
   * 예) 1
   */
  version: 1;

  /**
   * 발급 받은 APP Key (=Project Key) 입니다. (필수)
   */
  appKey: string;

  /**
   * 주소 구분 코드입니다. (선택)
   * - F01: 지번주소 (구주소)
   * - F02: 새(도로명) 주소
   * - F00: 구주소, 새(도로명)주소 타입 모두 가능 (Default)
   */
  addressFlag?: "F01" | "F02" | "F00" | string;

  /**
   * 지구 위의 위치를 나타내는 좌표 타입입니다. (선택)
   * - WGS84GEO: 경위도 (Default)
   * - EPSG3857: Google Mercator
   * - KATECH, BESSELGEO, BESSELTM, GRS80GEO, GRS80TM
   */
  coordType?:
    | "WGS84GEO"
    | "EPSG3857"
    | "KATECH"
    | "BESSELGEO"
    | "BESSELTM"
    | "GRS80GEO"
    | "GRS80TM"
    | string;

  /**
   * 응답 content-type을 선택합니다. (선택)
   * - 'json' (Default), 'xml'
   */
  format?: "json" | "xml";

  /**
   * jsonp 포맷에서 사용하는 callback 함수명 정보입니다. (선택)
   * application/javascript 일 때 필수로 입력해야 합니다.
   */
  callback?: string;

  /**
   * 페이지 번호 입니다. (선택)
   * Default: '1'
   */
  page?: string;

  /**
   * 페이지당 출력 개수 입니다. (선택)
   * - 최대 150개까지 지원합니다.
   * Default: '20'
   */
  count?: string;
}

/**
 * T map Full Text Geocoding API 응답(Response) 좌표 객체 타입
 */
export interface Coordinate {
  /**
   * 매칭 구분 코드입니다. (구주소/지번 기반)
   * - M00 ~ M33
   * - 값이 없을 수 있습니다.
   */
  matchFlag: string;

  /** 위도 좌표입니다. (구주소 기반) */
  lat: string;
  /** 경도 좌표입니다. (구주소 기반) */
  lon: string;
  /** 주소 입구점 위도 좌표입니다. (구주소 기반) */
  latEntr: string;
  /** 주소 입구점 경도 좌표입니다. (구주소 기반) */
  lonEntr: string;

  /** 시/도 명칭 (예: '서울특별시') */
  city_do: string;
  /** 군/구 명칭 (예: '영등포구') */
  gu_gun: string;
  /** 주소 읍면동 명칭 */
  eup_myun: string;
  /** 법정동 명칭 */
  legalDong: string;
  /** 법정동 명칭에 해당하는 코드 10자리 */
  legalDongCode: string;
  /** 행정동 명칭 */
  adminDong: string;
  /** 행정동 명칭에 해당되는 코드 10자리 */
  adminDongCode: string;
  /** 리 명칭 */
  ri: string;
  /** 지번 (예: '1-1', '2-1') */
  bunji: string;

  /** 구주소 매칭 시 건물 명 */
  buildingName: string;
  /** 구주소 매칭 시 건물 동 */
  buildingDong: string;

  /**
   * 새(도로명) 주소 좌표 매칭 구분입니다.
   * - N51 ~ N62
   */
  newMatchFlag: string;

  /** 새주소 매칭 시 위도 좌표 */
  newLat: string;
  /** 새주소 매칭 시 경도 좌표 */
  newLon: string;
  /** 새주소 매칭 시 위도 입구점 좌표 */
  newLatEntr: string;
  /** 새주소 매칭 시 경도 입구점 좌표 */
  newLonEntr: string;
  /** 새(도로명) 주소 매칭 시 길 이름 */
  newRoadName: string;
  /** 새(도로명) 주소 매칭 시 건물 번호 */
  newBuildingIndex: string;
  /** 새(도로명) 주소 건물명 매칭 시 건물 이름 */
  newBuildingName: string;
  /** 새주소 건물을 매칭한 경우 새주소 건물 동 */
  newBuildingDong: string;
  /** 새(도로명) 주소 건물 카테고리 명 */
  newBuildingCateName: string;
  /** 우편번호 */
  zipcode: string;
  /** 정매치 시 주소매칭에 사용되고 남은 나머지 주소 */
  remainder: string;
}

/**
 * T map Full Text Geocoding API 응답(Response)의 메타 정보 타입
 */
export interface CoordinateInfo {
  /**
   * 지구 위의 위치를 나타내는 좌표 타입입니다.
   * - WGS84GEO, EPSG3857 등
   */
  coordType: string;
  /**
   * 주소 구분 코드입니다.
   * - F01, F02, F00
   */
  addressFlag: string;
  /** 페이지 번호 */
  page: string;
  /** 페이지당 출력 개수 */
  count: string;
  /** 전체 조회된 수 */
  totalCount: string;
  /**
   * 좌표 정보 배열
   */
  coordinate: Coordinate[];
}

/**
 * T map Full Text Geocoding API 최종 응답(Response) 타입
 */
export interface FullAddrGeoResponse {
  coordinateInfo: CoordinateInfo;
}
