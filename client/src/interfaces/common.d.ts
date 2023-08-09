export interface CustomButtonProps {
  type?: string;
  title: string;
  backgroundColor: string;
  color: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  handleClick?: () => void;
}

export interface BuildingProps {
  _id: string;
  buildingName: string;
  photo?: string;
  floor?: string;
  creator?: string;
}

export interface ProfileProps {
  id: string;
  type: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
  


export interface UserFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (file) => void;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  userImage: { name: string; url: string };
  isAdmin?: string;
  role?: string;
}

export interface BuildingFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (file) => void;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  buildingImage: { name: string; url: string };
}

export interface FloorFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  onBuildingChange: (value: any) => void;
  buildingOptions?: { value: string; label: string }[];
  defaultBuildingValue?: string;
  selectedBuildingIndex?: string;
  defaultFloorValue?: string;
}

export interface SwitchFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  onBuildingChange: (value: any) => void;
  buildingOptions?: { value: string; label: string }[];
  onFloorChange: (value: any) => void;
  floorOptions?: { value: string; label: string }[];
}

export interface EditSwitchFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  selectedBuilding?: any;
  selectedFloor?: any;
}

export interface PortFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  onBuildingChange: (value: any) => void;
  buildingOptions?: { value: string; label: string }[];
  onFloorChange: (value: any) => void;
  floorOptions?: { value: string; label: string }[];
  onSwitchChange: (value: any) => void;
  switchOptions?: { value: string; label: string }[];
  onSwitchIPChange: (value: any) => void;
  switchIPOption?: { value: string; label: string }[];
}

export interface EditPortFormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  selectedBuilding?: any;
  selectedFloor?: any;
  selectedSwitch?: any;
  selectedSwitchIP?: any;
}
