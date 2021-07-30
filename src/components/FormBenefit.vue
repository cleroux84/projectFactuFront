<template>
  <v-form fill-width ref="benefitForm" lazy-validation>
    <v-row>
      <v-col cols="3">
        <v-text-field
            v-model="formBenefit.name"
            :label="labelForm.name"
            :rules="[rules.required]"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
            v-model.number="formBenefit.quantity"
            type="number"
            :label="labelForm.quantity"
            :rules="[rules.required]">
        >
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
            v-model.number="formBenefit.unitPrice"
            :label="labelForm.unitPrice"
            :rules="[rules.charOnly]"
          >
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-autocomplete
            v-model.number="formBenefit.vatRate"
            :label="labelForm.vatRate"
            :placeholder="labelForm.vatRate"
            :items="allVatRate"
            :rules="[rules.required]"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "FormBenefit.vue",
  computed: {
    ...mapGetters(['rules'])
  },
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
        name: " Prestation",
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