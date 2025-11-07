export class Usuario {
  constructor(
    public uid: string,
    public email: string,
    public nombre?: string,
    public foto?: string,
    public rol: 'admin' | 'usuario' = 'usuario',
    public carrito: string[] = []
  ) {}

  toFirestore() {
    return {
      email: this.email,
      nombre: this.nombre || null,
      foto: this.foto || null,
      rol: this.rol,
      lastLogin: new Date(),
      carrito:this.carrito
    };
  }
}
