<template>
  <v-row>
    <v-col cols="5">
      <v-text-field

          v-model="formBenefit.name"
          :label="labelForm.name"
          required>
      </v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
          v-model.number="formBenefit.quantity"
          :label="labelForm.quantity"
          required>
      </v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
          v-model.number="formBenefit.unitPrice"
          :label="labelForm.unitPrice"
          required>
      </v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
          v-model.number="formBenefit.vatRate"
          :label="labelForm.vatRate"
          required>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "FormBenefit.vue",
  methods: {
    checkBenefitForm: function () {
      if(this.formBenefit.name &&
      this.formBenefit.vatRate &&
      this.formBenefit.unitPrice &&
      this.formBenefit.quantity) {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      formBenefit: {
        name: "",
        quantity: "",
        unitPrice: "",
        vatRate: ""
      },
      labelForm: {
        name: "Sélectionner la prestation",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        vatRate: "TVA appliquée",
      }
    }
  }
}
</script>

<style scoped>

</style>