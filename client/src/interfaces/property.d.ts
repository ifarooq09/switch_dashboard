import { BaseKey } from "@refinedev/core";

export interface FormFieldProp {
  title: string;
  labelName: string;
}

export interface FormValues {
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: number | undefined;
}

export interface PropertyCardProps {
  id?: BaseKey | undefined;
  title: string;
  location: string;
  price: string;
  photo: string;
}

export interface BuildingCardProps {
  id?: BaseKey | undefined;
  buildingName: string;
  photo: string;
}

export interface FloorCardProps {
  id?: BaseKey | undefined;
  floorNumber: string;
  building: strign;
}

export interface SwitchCardProps {
  id?: BaseKey | undefined;
  title: string;
  ip: string;
  floorNumber: string;
  building: string;
}

export interface PortCardProps {
  id?: BaseKey | undefined;
  interfaceDetail: string;
  title: string;
  ciscophone: string;
  mac: string;
  switchtitle: string;
  switchip: string;
  floorNumber: string;
  building: string;
}

export interface DashboardPortCardProps {
  id?: BaseKey | undefined;
  interfaceDetail: string;
  title: string;
  ciscophone: string;
  mac: string;
}
