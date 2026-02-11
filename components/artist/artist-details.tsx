export default class ArtistDetails {
  private name: string;
  private time: Date;
  private details: string;

  constructor(name: string, time: Date, details: string) {
    this.name = name;
    this.time = time;
    this.details = details;
  }

  public getTimeString(): string {
    var hours = this.time.getHours();

    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    var strTime = hours + ' ' + ampm;

    return strTime;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setTime(time: Date) {
    this.time = time;
  }

  public getTime(): Date {
    return this.time;
  }

  public setDetails(details: string) {
    this.details = details;
  }

  public getDetails(): string {
    return this.details;
  }
}
