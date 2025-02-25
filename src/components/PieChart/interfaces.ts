export type PiePoints = {
    id: number;
    label: string
    value: number
}
  
export type TimeData = {
[key: number]: PiePoints[]
}