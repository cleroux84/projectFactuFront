<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Ajouter une banque</v-toolbar>
            <v-form fill-width ref="bankForm" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        v-model="formBank.name"
                        :label="labelForm.name"
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                        v-model="formBank.bankCode"
                        :label="labelForm.bankCode"
                        :rules="[rules.required]">
                      >
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                        v-model="formBank.guichetCode"
                        :label="labelForm.guichetCode"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        v-model="formBank.account"
                        :label="labelForm.account"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                        v-model.number="formBank.ribKey"
                        :label="labelForm.ribKey"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="formBank.iban"
                        :label="labelForm.iban"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="end"
                >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="show = false">Annuler</v-btn>
                    <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click.prevent="checkAddBankForm()">Valider</v-btn>
                  </v-card-actions>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import BankService from "../services/BankService";

export default {
  name: "AddBankForm",
  computed: {
    ...mapGetters(['rules', 'apiRoutes']),
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if(!value) {
          this.$emit('close')
        }
      }
    }
  },
  props: ['visible', 'myUser'],
  created() {
    // console.log(this.myUser)
  },
  data() {
    return {
      formBank: {
        name: "",
        bankCode: "",
        guichetCode: "",
        account: "",
        ribKey: null,
        iban: ""
      },
      labelForm: {
        name: "Nom de la banque",
        bankCode: "Code banque",
        guichetCode: "Code guichet",
        account: "Numéro de compte",
        ribKey: "Clé RIB",
        iban: "IBAN",
      }
    }
  },
  methods: {
    checkAddBankForm: function () {
      if(this.formBank.name &&
          this.formBank.bankCode &&
          this.formBank.guichetCode &&
          this.formBank.account &&
          this.formBank.ribKey &&
          this.formBank.iban
      ) {
        this.formBank.userId = this.myUser.user.id
        this.addNewBank()
      }
    },

    async addNewBank() {
      const accessToken = await this.$auth.getTokenSilently()
      if(this.$refs.bankForm.validate())
      BankService.addNewBank(accessToken, this.formBank).then (
            () => {
              this.show = false
            },
            response => console.log(response)
        )
    },
  }
}
</script>

<style scoped>

</style>