export default class Player {
  tag: string;
  firstName: string;
  lastName: string;
  id?: number;

  constructor(tag: string, firstName: string, lastName: string, id?: number) {
    this.tag = tag;
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
  }
}
