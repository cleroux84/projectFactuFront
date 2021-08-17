<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="dialog" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Modifier mes coordonnées bancaires</v-toolbar>
            <v-form fill-width ref="bankUpdateForm" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        v-model="myUser.bank.name"
                        :label="labelForm.name"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                        v-model="myUser.bank.bankCode"
                        :label="labelForm.bankCode"
                      >
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                        v-model="myUser.bank.guichetCode"
                        :label="labelForm.guichetCode"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        v-model="myUser.bank.account"
                        :label="labelForm.account"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                        v-model.number="myUser.bank.ribKey"
                        :label="labelForm.ribKey"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="myUser.bank.iban"
                        :label="labelForm.iban"
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
                    <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click="checkUpdateBankForm()">Valider</v-btn>
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
// import apiRoutes from "../router/apiRoutes";

export default {
  name: "UpdateBankForm",
  props: ['visible', 'myUser'],
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
      },
    }
  },
  created() {
    console.log(this.myUser.bank)
  },
  data() {
    return{
      dialog: true,
      labelForm: {
        name: "Nom de la banque",
        bankCode: "Code banque",
        guichetCode: "Code guichet",
        account: "Numéro de compte",
        ribKey: "Clé RIB",
        iban: "IBAN",
        userId: "userId"
      }
    }
  },
  methods: {
    checkUpdateBankForm: function () {
      if (this.myUser.bank.name &&
          this.myUser.bank.bankCode &&
          this.myUser.bank.guichetCode &&
          this.myUser.bank.account &&
          this.myUser.bank.ribKey &&
          this.myUser.bank.iban
      ) {
        this.updateBank()
      }
    },
    updateBank: function () {
      this.$axios.post(this.apiRoutes.updateBank(this.myUser.bank.id), this.myUser.bank).then(
          () => {
            // this.toggleDialog()
          },
          response => console.log(response)
      )
    },
    toggleDialog () {
      this.show = !this.show
      this.$emit('close', this.show)
    },
  }
}
</script>

<style scoped>

</style>