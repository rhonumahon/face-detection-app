export interface IRectangle {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IDetectionResult {
  rectangle: IRectangle;
  confidence: number;
  age: number;
  ageHigh: number;
  ageLow: number;
  gender: string;
}

export interface IResults {
  results: IDetectionResult[]
}