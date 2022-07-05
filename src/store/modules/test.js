<template>
  <div class="container-fluid">
    <ul class="breadcrmb">
      <li class="breadcrmb-item">
        <router-link to="/admin">Dashboard</router-link>
      </li>
      <li class="breadcrmb-item active" aria-current="page">
        <router-link to="/admin/orders">Orders</router-link>
      </li>
      <li class="breadcrmb-item active" aria-current="page">Edit</li>
    </ul>

    <div class="card border-0 m-0">
      <div class="card-body">
        <h5 class="card-title d-flex justify-content-between">Edit Order</h5>

        <div class="columns is-variable is-2 is-desktop is-multiline mt-1">
          <div class="control column is-one-third-desktop">
            <b-field label="Customer Name">
              <input
                class="input"
                type="text"
                placeholder="Customer Name"
                v-model.trim="$v.name.$model"
              />
              <div v-if="$v.name.$error">
                <div class="error" v-if="!$v.name.required">
                  Customer Name is required.
                </div>
                <div class="error" v-if="!$v.name.minLength">
                  Customer Name must have at least
                  {{ $v.name.$params.minLength.min }} letters.
                </div>
              </div>
            </b-field>
          </div>
          <div class="control column is-one-third-desktop">
            <b-field label="Customer address">
              <input
                class="input"
                type="text"
                placeholder="Customer address"
                v-model.trim="$v.address.$model"
              />
              <div v-if="$v.address.$error">
                <div class="error" v-if="!$v.address.required">
                  Customer address is required.
                </div>
                <div class="error" v-if="!$v.address.minLength">
                  Customer address must have at least
                  {{ $v.address.$params.minLength.min }} letters.
                </div>
              </div>
            </b-field>
          </div>
          <div class="control column is-one-third-desktop">
            <b-field label="Customer phone">
              <input
                class="input"
                type="number"
                placeholder="Customer phone"
                v-model.trim="$v.phone.$model"
              />
              <div v-if="$v.phone.$error">
                <div class="error" v-if="!$v.phone.required">
                  Customer phone is required.
                </div>
                <div class="error" v-if="!$v.phone.minLength">
                  Customer phone must have at least
                  {{ $v.phone.$params.minLength.min }} numbers.
                </div>
                <div class="error" v-if="!$v.phone.maxLength">
                  Customer phone must less than
                  {{ $v.phone.$params.maxLength.max }} numbers.
                </div>
              </div>
            </b-field>
          </div>
          <div
            class="control column is-one-third-desktop"
            v-if="this.$gate.checkSuperAdmin()"
          >
            <b-field label="Vendor">
              <b-select
                placeholder="Select a Vendor"
                expanded
                v-model.trim="$v.vendorid.$model"
              >
                <option
                  v-for="vendor in this.getVendors"
                  :value="vendor.id"
                  :key="vendor.id"
                >
                  {{ vendor.name }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="control column is-full-desktop text-center">
            <b-button type="is-primary" size="is-small" @click="addProduct()">
              Add Product<font-awesome-icon
                icon="plus"
                class="ml-2"
                style="color: white"
              ></font-awesome-icon>
            </b-button>
          </div>
          <div class="control column is-full-desktop">
            <div
              class="d-flex align-items-end flex-wrap mb-2 shadow-sm"
              v-for="(product, index) of this.newProducts"
              :key="index"
              style="padding: 24px 8px; border-radius: 8px; background: #f4f4f4"
            >
              <div
                v-for="(photo, index) in newProducts[index].photos"
                :key="index"
                class="mr-1"
              >
                <img
                  v-if="index == 0"
                  :src="imgPath(photo.url)"
                  style="
                    border-radius: 10%;
                    height: 50px;
                    width: 50px;
                    object-fit: contain;
                  "
                />
              </div>
              <div class="flex-fill">
                <b-field label="Product">
                  <b-select
                    placeholder="Select a Product"
                    expanded
                    v-model.trim="newProducts[index].productid"
                    @input="productChanged($event, index)"
                  >
                    <option
                      v-for="product in getProductName"
                      :value="product.id"
                      :key="product.id"
                    >
                      {{ product.title }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div
                class="flex-fill mx-2"
                v-if="newProducts[index].variants.length > 0"
              >
                <b-field label="Color">
                  <b-select
                    placeholder="Select a Color"
                    expanded
                    :disabled="newProducts[index].colordisabled"
                    v-model="newProducts[index].colorid"
                    @input="colorChanged($event, index)"
                  >
                    <option
                      v-for="color in newProducts[index].variants"
                      :value="color.id"
                      :key="color.id"
                    >
                      {{ color.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div
                class="flex-fill mx-2"
                v-if="newProducts[index].sizes.length > 0"
              >
                <b-field label="Size">
                  <b-select
                    placeholder="Select a Size"
                    expanded
                    :disabled="newProducts[index].sizedisabled"
                    v-model.trim="newProducts[index].sizeid"
                    @input="sizeChanged($event, index)"
                  >
                    <option
                      v-for="size in newProducts[index].sizes"
                      :value="size.id"
                      :key="size.id"
                    >
                      {{ size.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="mx-2">
                <b-field label="Quantity">
                  <input
                    class="input bg-white"
                    type="number"
                    onkeydown="return false"
                    :disabled="newProducts[index].qtydisabled"
                    style="width: 100px"
                    min="0"
                    :max="newProducts[index].maxQty"
                    @input="qtyChanged($event, index)"
                    v-model.trim="newProducts[index].qty"
                  />
                </b-field>
              </div>
              <div class="mx-2">
                <b-field label="Rate">
                  <input
                    class="input bg-white"
                    type="number"
                    disabled
                    style="width: 100px"
                    v-model.trim="newProducts[index].rate"
                  />
                </b-field>
              </div>
              <div class="mx-2">
                <b-field label="Amount">
                  <input
                    class="input bg-white"
                    type="number"
                    disabled
                    style="width: 200px"
                    v-model.trim="newProducts[index].amount"
                  />
                </b-field>
              </div>
              <div class="mx-2">
                <a @click="deleteRow(index)">
                  <font-awesome-icon
                    icon="trash"
                    style="color: red; font-size: 18px"
                  ></font-awesome-icon>
                </a>
              </div>
            </div>
          </div>

          <div class="control column is-full-desktop">
            <div class="columns justify-content-end">
              <div class="control column is-two-quarter-desktop">
                <b-field label="Notes(If any)">
                  <b-input
                    maxlength="255"
                    type="textarea"
                    placeholder="Note"
                    v-model.trim="$v.note.$model"
                  ></b-input>
                </b-field>
              </div>
              <div class="control column is-one-third-desktop bg-light">
                <b-field label="Gross Amount">
                  <input
                    class="input"
                    type="text"
                    disabled
                    placeholder="Gross Amount"
                    v-model.trim="$v.grossamt.$model"
                  />
                  <div v-if="$v.grossamt.$error">
                    <div class="error" v-if="!$v.grossamt.required">
                      Gross Amount is required.
                    </div>
                  </div>
                </b-field>

                <b-field :label="Vat(${getVat}%)">
                  <input
                    class="input"
                    type="text"
                    disabled
                    v-model.trim="$v.vat.$model"
                  />
                  <div v-if="$v.vat.$error">
                    <div class="error" v-if="!$v.vat.required">
                      Vat is required.
                    </div>
                  </div>
                </b-field>

                <b-field
                  :label="Service Charge(${getServiceCharge}%)"
                  v-if="getServiceCharge != 0"
                >
                  <input
                    class="input"
                    type="text"
                    disabled
                    v-model.trim="$v.servicecharge.$model"
                  />
                </b-field>

                <b-field label="Discount">
                  <input
                    class="input"
                    type="text"
                    placeholder="Discount"
                    @input="discountChanged"
                    v-model.trim="$v.discount.$model"
                  />
                </b-field>

                <b-field label="Net Amount">
                  <input
                    class="input"
                    type="text"
                    disabled
                    placeholder="Net Amount"
                    v-model.trim="$v.netamt.$model"
                  />
                  <div v-if="$v.netamt.$error">
                    <div class="error" v-if="!$v.netamt.required">
                      Net Amount is required.
                    </div>
                  </div>
                </b-field>
              </div>
            </div>
          </div>

          <div class="control column is-full-desktop">
            <b-button
              type="is-info"
              size="is-small"
              :loading="this.buttonLoading"
              @click="save()"
              >Edit Order</b-button
            >
            <b-button
              type="is-danger"
              size="is-small"
              @click="$router.push({ name: 'orders' })"
            >
              Back
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getImgPath } from "../utils/path";
import _ from "lodash";
import { validateOrderForm } from "../validation";
import { VueEditor } from "vue2-editor";
export default {
  components: { VueEditor },
  async created() {
    await this.$store.dispatch("product/fetch");
    const result = await this.$store.dispatch(
      "order/fetchOne",
      this.$route.params.id
    );

    this.orderid = result.id;
    this.name = result.name;
    this.address = result.address;
    this.phone = result.phone;
    this.grossamt = result.grossamt;
    this.vat = result.vat;
    this.discount = result.discount;
    this.netamt = result.netamt;
    this.vendorid = result.vendorid;
    this.note = result.note;
    result.products.forEach((product, index) => {
      this.newProducts.push({
        productid: product.productid,
        rate: "",
        qty: product.qty,
        colorid: product.colorid,
        sizeid: product.sizeid,
        qtydisabled: true,
        colordisabled: true,
        sizedisabled: true,
        maxQty: 1,
        amount: "",
        variantid: "",
        variants: [],
        sizes: [],
      });
      this.productChanged(product.productid, index);
      this.colorChanged(product.colorid, index);
      this.sizeChanged(product.sizeid, index);
    });
  },
  data() {
    return {
      buttonLoading: false,
      name: "",
      address: "",
      phone: "",
      grossamt: 0,
      vat: 0,
      servicecharge: 0,
      deliverycharge: 0,
      discount: 0,
      netamt: 0,
      vendorid: "",
      note: "",
      newProducts: [],
    };
  },
  methods: {
    ...mapMutations({
      addSuccess: "order/ADD_SUCCESS",
      editSuccess: "order/EDIT_SUCCESS",
    }),
    imgPath: getImgPath,
    addProduct() {
      this.newProducts.push({
        orderid: "",
        productid: "",
        rate: "",
        qty: 0,
        amount: "",
        colorid: "",
        sizeid: "",
        variantid: "",
        qtydisabled: true,
        colordisabled: true,
        sizedisabled: true,
        maxQty: 1,
        variants: [],
        sizes: [],
        photos: [],
      });
    },
    qtyChanged($e, index) {
      this.newProducts[index].amount =
        $e.target.value * this.newProducts[index].rate;
      this.calculateGross();
    },
    colorChanged($e, index) {
      const filterVariants = this.newProducts[index].variants.filter(
        (variant) => variant.id == $e
      );

if (filterVariants.length > 0) {
        this.newProducts[index].sizes = filterVariants[0].size;
        this.newProducts[index].sizedisabled = false;
        this.newProducts[index].amount = 0;
        this.newProducts[index].rate = 0;
        this.calculateGross();
      } else {
        this.newProducts[index].sizedisabled = true;
      }
    },
    sizeChanged($e, index) {
      const filteredSizes = this.newProducts[index].sizes.filter(
        (size) => size.id == $e
      );
      if (filteredSizes.length > 0) {
        this.newProducts[index].variantid = filteredSizes[0].variantid;
        this.newProducts[index].rate = filteredSizes[0].price;
        this.newProducts[index].amount =
          filteredSizes[0].price * this.newProducts[index].qty;
        this.newProducts[index].qtydisabled = false;
        this.newProducts[index].sizes.filter(
          (size) => size.id == this.newProducts[index].sizeid
        );
        this.newProducts[index].maxQty = filteredSizes[0].maxqty;
        this.calculateGross();
      }
    },
    productChanged($e, index) {
      const product = this.products.filter((product) => product.id == $e);
      if (product.length > 0) {
        this.newProducts[index].rate = product[0].price;
        const tempVariants = [];
        product[0].variants.map((variant) => {
          const found = _.find(tempVariants, { id: variant.color.id });
          if (found) {
            found.size.push({
              maxqty: variant.qty,
              variantid: variant.id,
              name: variant.size.name,
              id: variant.size.id,
              price: variant.price,
            });
          } else {
            tempVariants.push({
              id: variant.color.id,
              name: variant.color.name,
              size: [
                {
                  maxqty: variant.qty,
                  variantid: variant.id,
                  price: variant.price,
                  name: variant.size.name,
                  id: variant.size.id,
                },
              ],
            });
          }
        });
        this.newProducts[index].photos = product[0].photos;
        this.newProducts[index].variants = tempVariants;
        this.newProducts[index].colordisabled = false;
      }
    },
    discountChanged($e) {
      this.discount = $e.target.value;
      this.calculateGross();
    },
    calculateGross() {
      this.grossamt = 0;
      this.newProducts.forEach((product) => {
        this.grossamt += product.amount;
      });
      this.vat = (this.getVat / 100) * this.grossamt;
      this.servicecharge = (this.getServiceCharge / 100) * this.grossamt;
      let totalAmt = this.grossamt + this.vat + this.servicecharge;
      if (totalAmt != 0) {
        this.netamt = totalAmt - this.discount;
      } else {
        this.netamt = 0;
      }
    },
    deleteRow(index) {
      this.newProducts.splice(index, 1);
      this.calculateGross();
    },
    async save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.buttonLoading = true;
        const data = {
          id: this.orderid,
          name: this.name,
          address: this.address,
          phone: this.phone,
          grossamt: this.grossamt,
          vat: this.vat,
          note: this.note,
          vendorid: this.vendorid,
          discount: this.discount,
          netamt: this.netamt,
          products: this.newProducts,
        };
        try {
          const result = await this.$store.dispatch("order/edit", data);
          this.editSuccess(result);
          this.$buefy.notification.open({
            message: "Order Edit Successfully",
            type: "is-success",
            position: "is-bottom-right",
          });
          this.$store.dispatch("product/fetch");
          this.buttonLoading = false;
          this.$router.push({ name: "orders" });
        } catch (e) {
          this.buttonLoading = false;
          this.$buefy.notification.open({
            duration: 5000,
            message: e.response.data.error.message,

position: "is-bottom-right",
            type: "is-danger",
          });
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      products: "product/products",
      settings: "setting/settings",
      vendors: "vendor/vendors",
    }),
    getProductName: function () {
      if (this.products.length > 0) {
        return this.products
          .map((product) => {
            return {
              title: product.title,
              qty: product.qty,
              price: product.price,
              id: product.id,
              published: product.published,
            };
          })
          .filter((product) => product.published);
      }
    },
    getSizes: function () {
      if (this.sizes.length > 0) {
        return this.sizes;
      }
    },
    getVat: function () {
      if (this.settings.length > 0) {
        return this.settings.filter((set) => set.key == "vat").length > 0
          ? this.settings.filter((set) => set.key == "vat")[0].value
          : "";
      }
    },
    getServiceCharge: function () {
      if (this.settings.length > 0) {
        return this.settings.filter((set) => set.key == "servicecharge")
          .length > 0
          ? this.settings.filter((set) => set.key == "servicecharge")[0].value
          : "";
      }
    },
    getCurrency: function () {
      if (this.settings.length > 0) {
        return this.settings.filter((set) => set.key == "currency").length > 0
          ? this.settings.filter((set) => set.key == "currency")[0].value
          : "";
      }
    },
    getVendors: function () {
      if (this.vendors.length > 0) {
        return this.vendors.map((vendor) => {
          return {
            name: vendor.name,
            id: vendor.id,
          };
        });
      }
    },
  },
  validations: validateOrderForm(),
};
</script>