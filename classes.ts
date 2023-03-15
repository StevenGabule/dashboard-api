class Coord {
  lat: number;
  long: number;

  computeDistance(newLat: number, newLong: number) : number {
    return 0;
  }

  constructor(lat: number, long: number) {
    this.lat = lat;
    this.long = long;
  }
}

const point = new Coord(0,1);

class MapLocation extends Coord {
  _name: string;
  
  public get name() : string {
    return this._name;
  }
  
  public set name(v : string) {
    this._name = v;
  }
  
  override computeDistance(newLat: number, newLong: number) : number {
    return 1;
  }

   constructor(lat: number, long: number, name: string) {
    super(lat, long);
    this._name = name;
  }

}

interface LoggerService {
  log: (s: string) => void;
}

class Logger implements LoggerService {
  /**
   * log
   */
  public log(s: string) : void {
    console.log(s)
  }

  private error() {}
  private a = "a";
}

const lg = new Logger();

class MyClass<T>{
  a: T;
}

const b = new MyClass<string>();
b.a;

abstract class Base {
  print(s: string) {
    console.log(s);
  }
  abstract error(s: string) : void
}

class BaseExtended extends Base {
  error(s: string): void {
      
  }
}

new BaseExtended().print('Hello world');

class Animal {
  name: string;
}

class Dog extends Animal {
  name :string;
  tail: boolean;
}

const puppy: Dog = new Dog();

puppy.name = "rost";
puppy.tail = true;














