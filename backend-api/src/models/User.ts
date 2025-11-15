export class User {
  constructor(
    public uid: string,
    public email: string,
    public name?: string,
    public image?: string,
    public rol: 'admin' | 'usuario' = 'usuario',
  ) {}

  toFirestore() {
    return {
      email: this.email,
      name: this.name || null,
      image: this.image || null,
      rol: this.rol,
      lastLogin: new Date(),
    };
  }
}
