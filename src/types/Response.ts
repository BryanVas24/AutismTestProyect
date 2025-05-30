export interface IResponse<T> {
    value?: T
    status: boolean
    msg?: string
}