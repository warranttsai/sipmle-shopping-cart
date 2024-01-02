// single product item data
class UiGoods {
  constructor(g) {
    this.data = g;
    this.choose = 0;
  }

  getTotalPrice() {
    return this.data.price * this.choose;
  }

  isChoose() {
    return this.choose > 0;
  }

  increase() {
    this.choose++;
  }

  decreaase() {
    if (this.choose === 0) {
      return;
    }
    this.choose--;
  }
}

// interface data
class UiData {
  constructor() {
    let uiGoods = [];
    for (const item of goods) {
      const uig = new UiGoods(item);
      uiGoods.push(uig);
    }
    this.uiGoods = uiGoods;
    this.deliveryThreshold = 30;
    this.deliveryPrice = 5;
  }

  getTotalPrice() {
    let sum = 0;
    for (const item of goods) sum += item.getTotalPrice();
    return sum;
  }

  increase(index) {
    this.uiGoods[index].increase();
  }
  decrease(index) {
    this.uiGoods[index].decreaase();
  }
}

const ui = new UiData();
