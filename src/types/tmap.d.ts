export {};

type TMapLatLng = any;
export type TMapInstance = any;

declare global {
  interface Window {
    Tmapv3: {
      LatLng: new (lat: number, lng: number) => TMapLatLng;
      Map: new (mapId: string, options: any) => TMapInstance;
      Marker: any;
    };
  }

  const Tmapv3: Window["Tmapv3"];
}
