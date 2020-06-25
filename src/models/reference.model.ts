export default class Reference
{
    identifier: string
    name: string

    constructor(identifier?: string, name?: string)
    {
        this.identifier = identifier
        this.name = name
    }

    static fromObject(obj: unknown): Reference
    {
        const reference = new Reference()
        return Object.assign(reference, obj)
    }
}