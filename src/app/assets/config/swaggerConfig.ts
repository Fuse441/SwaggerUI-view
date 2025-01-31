export interface swaggerAPI{
    name:string
    fileName:string
}

export const configSwagger:swaggerAPI[] = [
    {
        name:"cancelStock",
        fileName: "test.yaml"
    },
    {
        name:"checkOrder",
        fileName: "test2.yaml"
    }
]



