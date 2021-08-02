enum Types {
  Integer,
  Float,
  String,
  Boolean,
}

class Enum {
  values: string[];
  constructor(values: string[]) {
    this.values = values;
  }
}

class IdReference {

}

class Collection {

}

class RecordReference {
  
}

export class Schema {
  static Types = Types;
  static Enum = (values: string[]) => new Enum(values);
  static RecordReference: RecordReference;
  static IdReference: IdReference;
  static Collection: Collection;
}
