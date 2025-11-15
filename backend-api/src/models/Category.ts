export class Category {
  constructor(
    public name: string,
    public description: string,
    public createdAt?: string,
    public id?: string,
    public updatedAt?: string
  ) {}
  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
