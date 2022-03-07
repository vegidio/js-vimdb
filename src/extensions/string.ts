// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
    leftOf(substring: string): string;
    rightOf(substring: string): string;
}

String.prototype.leftOf = function (substring: string): string {
    return this.substring(0, this.indexOf(substring));
};

String.prototype.rightOf = function (substring: string): string {
    return this.substring(this.indexOf(substring) + 1);
};
