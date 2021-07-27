<template>
  <v-form fill-width ref="benefitForm" lazy-validation>
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
        <v-autocomplete
            v-model.number="formBenefit.vatRate"
            :label="labelForm.vatRate"
            :placeholder="labelForm.vatRate"
            :items="allVatRate"
            required>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: "FormBenefit.vue",
  methods: {
    resetFormBenefit: function () {
      this.$nextTick(() => {
        this.formBenefit.name = ""
        this.formBenefit.quantity = null
        this.formBenefit.unitPrice = null
        this.formBenefit.vatRate = null
      })

      // this.$refs.benefitForm.reset()
    },
    checkBenefitForm: function () {
      return !!(this.formBenefit.name ||
          this.formBenefit.vatRate ||
          this.formBenefit.unitPrice ||
          this.formBenefit.quantity);
    }
  },
  data() {
    return {
      formBenefit: {
        name: "",
        quantity: null,
        unitPrice: null,
        vatRate: null
      },
      allVatRate: [5.5, 10, 20],
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