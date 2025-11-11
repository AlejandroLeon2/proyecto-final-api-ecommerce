export class Product {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public category: string,
    public status: "active" | "inactive",
    public image: string,
    public createdAt?: Date,
    public id?: string,
    public updatedAt?: Date
  ) {}
  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      createdAt: this.createdAt ,
      stock: this.stock,
      category: this.category,
      status: this.status,
      image: this.image,
      updatedAt: this.updatedAt
    };
  }
}
