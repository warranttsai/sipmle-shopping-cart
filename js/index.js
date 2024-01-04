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
    for (const index in goods) {
      const g = this.uiGoods[index];
      sum += g.getTotalPrice();
    }
    return sum;
  }

  // increase the number of the specific product
  increase(index) {
    this.uiGoods[index].increase();
  }

  // decrease the number of the specific product
  decrease(index) {
    this.uiGoods[index].decreaase();
  }

  getTotalChooseNumber() {
    let sum = 0;
    for (const item of this.uiGoods) sum += item.choose;
    return sum;
  }

  hasGoodsInCart() {
    return this.getTotalChooseNumber > 0;
  }

  isOverDeliveryThreshold() {
    return this.getTotalPrice >= this.deliveryThreshold;
  }

  isChoose(index) {
    return this.uiGoods[index].isChoose();
  }
}

class UI {
  constructor() {
    this.uiData = new UiData();
    this.doms = {
      goodsContainer: null,
      deliveryPrice: null,
      footerPay: null,
      footerPayInnerSpan: null,
      totalPrice: null,
      cart: null,
      badge: null,
      jumpDestination: {},
    };

    document.addEventListener("DOMContentLoaded", () => {
      this.doms.goodsContainer = document.querySelector(".goods-list");
      this.doms.deliveryPrice = document.querySelector(".footer-car-tip");
      this.doms.footerPay = document.querySelector(".footer-pay");
      this.doms.footerPayInnerSpan = document.querySelector(".footer-pay span");
      this.doms.totalPrice = document.querySelector(".footer-car-total");
      this.doms.cart = document.querySelector(".footer-car");
      this.doms.badge = document.querySelector(".footer-car-badge");

      // get the jump animation destination
      const carRect = this.doms.cart.getBoundingClientRect();
      const jumpDestination = {
        x: carRect.left + carRect.width / 2,
        y: carRect.top + carRect.height / 5,
      };
      this.jumpDestination = jumpDestination;

      this.createHTML();
      this.updateFooter();
      this.listenEvent();
    });
  }

  listenEvent() {
    this.doms.cart.addEventListener("animationend", function () {
      this.classList.remove("animate");
    });
  }

  // based on the provided data, create the product items
  createHTML() {
    let html = "";
    for (const item of this.uiData.uiGoods) {
      const g = item;
      html += `
      <div class="goods-item">
        <img src="./assets/${g.data.pic}" alt="" class="goods-pic />
        <div> class="good-info">
          <h2 class="good-title">${g.data.title}</h2>
          <p class="goods-desc">${g.data.desc}</p>
          <p class="good-sell">
            <span>Monthly sell ${g.data.sellNumber}</span>
            <span>Rate ${g.data.favorRate}%</span>
          </p>
        </div>
        <div class="good-confirm>
          <p class="good-price>
            <span class="goods-price-unit">$</span>
            <span>${g.data.price}</span>
          </p>
          <div class="goods-btns">
            <i index="${this.uiData.uiGoods.indexOf(
              item
            )}"class="iconfont i-jianhao"></i>
            <span>${g.choose}</span>
            <i index="${this.uiData.uiGoods.indexOf(
              item
            )}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
      `;
    }
    this.doms.goodsContainer.innerHTML = html;
  }

  increase(index) {
    this.uiData.increase(index);
    this.updateGoodsItem(index);
    this.updateFooter();
    this.elementJumpAnimate(index);
  }

  decrease(index) {
    this.uiData.decrease(index);
    this.updateGoodsItem(index);
    this.updateFooter();
  }

  // update the stauts of the item
  updateGoodsItem(index) {
    const itemDom = this.doms.goodsContainer.children[index];
    if (this.uiData.isChoose(index)) itemDom.classList.add("active");
    else itemDom.classList.remove("active");

    const span = itemDom.querySelector(".goods-btns span");
    span.textContent = this.uiData.uiGoods[index].choose;
  }

  // update the footer
  updateFooter() {
    // get amount
    const total = this.uiData.getTotalPrice();
    // get delivery fee
    this.doms.deliveryPrice.textContent = `Deliver fee $${this.uiData.deliveryPrice}`;
    // calculate the distance for delivery
    if (this.uiData.isOverDeliveryThreshold())
      this.doms.footerPay.classList.add("active");
    else {
      this.doms.footerPay.classList.remove("active");
      // update the distance
      const dis = Math.round(this.uiData.deliveryThreshold - total);
      this.doms.footerPayInnerSpan.textContent = `-${dis} for delivery`;
    }
    // set amount
    this.doms.totalPrice.textContent = total.toFixed(2);
    // set cart style
    if (this.uiData.hasGoodsInCart()) this.doms.cart.classList.add("active");
    else this.doms.cart.classList.remove("active");
    // set cart number
    this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
  }

  // cart animation
  carAnimate() {
    this.doms.cart.classList.add("animate");
  }

  // element jump animation
  elementJumpAnimate(index) {
    // find the specific item's add button
    const btnAdd = this.doms.goodsContainer.children[index].querySelector(
      ".i-jiajianzujianjiahao"
    );
    const rect = btnAdd.getBoundingClientRect();
    const start = {
      x: rect.left,
      y: rect.top,
    };
    // jump
    const div = document.createElement("div");
    div.className = "add-to-car";
    const i = document.createElement("i");
    i.className = `iconfont i-jiajianzujianjiahao`;
    // set default position
    div.style.transform = `translateX(${start.x}px`;
    i.style.transform = `translateY(${start.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    // force re-rendering
    div.clientWidth;
    // set destination
    div.style.transform = `translateX(${this.jumpDestination.x}px`;
    i.style.transform = `translateY(${this.jumpDestination.y}px)`;

    const that = this;
    div.addEventListener(
      "transitionend",
      function () {
        div.remove();
        that.carAnimate();
      },
      { once: true }
    );
  }
}
const ui = new UI();

// event
ui.doms.goodsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("i-jiajianzujianjiahao")) {
    const index = +e.target.getAttribute("index");
    ui.increase(index);
  } else if (e.target.classList.contains("i-jianhao")) {
    const index = +e.target.getAttribute("index");
    ui.decrease(index);
  }
});
