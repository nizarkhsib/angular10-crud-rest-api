export class User {
    id: number;
    name: string;
    email: string;
    type: string;
    isEdit = false;

    constructor(name: string, email: string, type: string, id: number) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.type = type;
      this.isEdit = false;
    }
  }

