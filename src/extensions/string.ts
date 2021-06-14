interface String {
    leftOf(substring: string): string;
}

String.prototype.leftOf = function (substring: string): string {
    return this.substring(0, this.indexOf(substring));
};
