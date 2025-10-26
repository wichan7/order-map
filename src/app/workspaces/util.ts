export const getAddressByLatLng = (lat: number, lng: number) => {
  return new Promise<{
    address: kakao.maps.services.Address;
    road_address: kakao.maps.services.RoadAaddress | null;
  } | null>((res) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (addresses) => {
      res(addresses[0] ?? null);
    });
  });
};
