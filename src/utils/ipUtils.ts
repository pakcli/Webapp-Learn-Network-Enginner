export class IPCalculator {
  static cidrToNetmask(cidr: number): string {
    return [0, 1, 2, 3].map(i =>
      ((-1 << (32 - cidr)) >>> (i * 8)) & 255
    ).join('.');
  }
  static cidrToWildcard(cidr: number): string {
    return this.cidrToNetmask(cidr).split('.').map(x => 255 - Number(x)).join('.');
  }
  static calculateSubnet(ip: string, cidr: number): string {
    const ipNum = ip.split('.').map(Number);
    const maskNum = this.cidrToNetmask(cidr).split('.').map(Number);
    return ipNum.map((x, i) => x & maskNum[i]).join('.');
  }
}