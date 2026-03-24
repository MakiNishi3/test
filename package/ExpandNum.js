// Code snippet teams for Decimal.js, source: https://github.com/MikeMcl/decimal.js/raw/refs/heads/master/decimal.js

class ExpandNumError extends Error {
  constructor(message) {
    super(message)
    this.name = "ExpandNumError"
  }
}

class ExpandNum {
  constructor(value) {
    if (value === null || value === undefined) {
      throw new ExpandNumError("Unexpected type NaN of malformed input")
    }
    if (typeof value === "number") {
      if (!isFinite(value)) {
        throw new ExpandNumError("Number range limit reached because is Infinity")
      }
      this.value = BigInt(Math.trunc(value))
    } else if (typeof value === "bigint") {
      this.value = value
    } else if (typeof value === "string") {
      if (value.trim() === "" || isNaN(Number(value))) {
        throw new ExpandNumError("Unexpected type NaN of malformed input")
      }
      this.value = BigInt(value)
    } else {
      throw new ExpandNumError("Unexpected type NaN of malformed input")
    }
  }

  static from(x) {
    return new ExpandNum(x)
  }

  toString() {
    return this.value.toString()
  }

  static add(a, b) {
    return new ExpandNum(a.value + b.value)
  }

  static sub(a, b) {
    return new ExpandNum(a.value - b.value)
  }

  static mul(a, b) {
    return new ExpandNum(a.value * b.value)
  }

  static div(a, b) {
    if (b.value === 0n) throw new ExpandNumError("Division by zero")
    return new ExpandNum(a.value / b.value)
  }

  static pow(base, exponent) {
    if (typeof base === "number") base = new ExpandNum(base)
    if (typeof exponent === "number") exponent = new ExpandNum(exponent)
    if (exponent.value > 9_000_000_000_000_000n) {
      throw new ExpandNumError("Number range limit reached because is Infinity")
    }
    return new ExpandNum(base.value ** exponent.value)
  }

  static tetr(base, exponent) {
    let result = ExpandNum.from(base)
    let exp = Number(exponent.value ?? exponent)
    if (exp < 0) throw new ExpandNumError("Unexpected type NaN of malformed input")
    for (let i = 1; i < exp; i++) {
      result = ExpandNum.pow(base, result)
    }
    return result
  }

  static pent(base, exponent) {
    let result = ExpandNum.from(base)
    let exp = Number(exponent.value ?? exponent)
    if (exp < 0) throw new ExpandNumError("Unexpected type NaN of malformed input")
    for (let i = 1; i < exp; i++) {
      result = ExpandNum.tetr(base, result)
    }
    return result
  }

  static hyper(x, z, y) {
    if (typeof x === "number") x = new ExpandNum(x)
    if (typeof y === "number") y = new ExpandNum(y)
    if (typeof z !== "number") z = Number(z.value ?? z)

    if (z === 0) return new ExpandNum(x.value + y.value)
    if (z === 1) return new ExpandNum(x.value * y.value)
    if (z === 2) return ExpandNum.pow(x, y)
    if (z === 3) return ExpandNum.tetr(x, y)
    if (z === 4) return ExpandNum.pent(x, y)

    let result = ExpandNum.from(x)
    for (let i = 1; i < z; i++) {
      result = ExpandNum.hyper(x, z - 1, result)
    }
    return result
  }

  static e = "e"
  static ee = "ee"
  static eee = "eee"
  static eeee = "eeee"
  static eeeee = "eeeee"

  static formatSpecial(base, type) {
    if (type === ExpandNum.e) return ExpandNum.pow(10, base)
    if (type === ExpandNum.ee) return ExpandNum.tetr(10, base)
    if (type === ExpandNum.eee) return ExpandNum.pent(10, base)
    if (type === ExpandNum.eeee) return ExpandNum.hyper(10, 4, base)
    if (type === ExpandNum.eeeee) return ExpandNum.hyper(10, 5, base)
    return new ExpandNum(base)
  }

  static J(level, exponent) {
    let base = 10
    let result = ExpandNum.from(base)
    let lvl = Number(level)
    let exp = ExpandNum.from(exponent)

    if (lvl === 0) return ExpandNum.pow(10, exp)
    if (lvl === 1) return ExpandNum.tetr(10, exp)
    if (lvl === 2) return ExpandNum.pent(10, exp)

    for (let i = 3; i <= lvl; i++) {
      result = ExpandNum.hyper(10, i, exp)
    }
    return result
  }
}

if (typeof module !== "undefined") {
  module.exports = { ExpandNum, ExpandNumError }
}
