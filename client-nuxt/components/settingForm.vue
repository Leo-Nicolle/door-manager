<template>
  <form-modal
    v-if="settings"
    ref="form"
    title="Paramettres"
    :item="settings"
    :schema="schema"
    :buttons="['submit', 'close']"
    @submit="submit"
    @close="$emit('close')"
  >
    <template v-slot:mail>
      <div class="box">
        <h3 class="title is-4">
          Email
          <b-tooltip
            label="Cette boite mail sert à contacter les utilisateurs(en cas de mot de passe oublié etc) "
            position="is-right"
            multilined
          >
            <b-icon
              size="is-small"
              type="is-warning"
              icon="help-circle-outline"
            ></b-icon>
          </b-tooltip>
        </h3>
        <div class="divider is-right"></div>
        <b-field label="Addresse">
          <b-input
            rounded
            v-model="settings.mail.id"
            placeholder="email@labaux.com"
          />
        </b-field>
        <b-field label="Mot de passe">
          <b-input
            rounded
            v-model="settings.mail.password"
            password-reveal
            type="password"
          />
        </b-field>
        <tooltip-field
          label="Service"
          tooltip="Service associé à la boite mail (https://nodemailer.com/smtp/well-known/)"
        >
          <b-input
            rounded
            v-model="settings.mail.service"
            placeholder="Service..."
          />
        </tooltip-field>
      </div>
    </template>
    <template v-slot:door>
      <div class="box">
        <h3 class="title is-4">Portes</h3>
        <div class="divider is-right"></div>

        <tooltip-field
          label="Url serveur"
          tooltip="Url du serveur sur lequel les portes vont faire leurs requètes."
        >
          <b-input
            rounded
            v-model="settings.doorDefaults.baseUrl"
            placeholder="http://ip-serveur:PORT/"
          />
        </tooltip-field>

        <tooltip-field
          label="Mot de passe OTA"
          tooltip="Mot de passe pour les communications entre le serveur et les portes pedant les mises à jour."
        >
          <b-input
            rounded
            password-reveal
            type="password"
            v-model="settings.doorDefaults.passwordOTA"
          />
        </tooltip-field>
        <tooltip-field
          label="SSID wifi"
          :tooltip="`SSID(nom) du resau wifi auquel les portes doivent se connecter.`"
        >
          <b-input rounded v-model="settings.doorDefaults.ssid" />
        </tooltip-field>
        <tooltip-field
          label="Mot de passe wifi"
          tooltip="Mot de passe du resau wifi auquel les portes doivent se connecter."
        >
          <b-input
            rounded
            v-model="settings.doorDefaults.wifiPassword"
            type="password"
            password-reveal
          />
        </tooltip-field>

        <tooltip-field
          label="Fréquence de Ping"
          tooltip="Fréquence à laquelle les portes signalent au serveur qu'elles sont toujours en ligne.(en minutes)"
        >
          <b-numberinput
            rounded
            v-model="settings.doorDefaults.pingFrequency"
            step="0.01"
          />
        </tooltip-field>

        <tooltip-field
          label="Chemin vers le code"
          tooltip="Chemin (sur le serveur) vers la racine du dossier 'door-lock' contenant le code à transférer sur les portes "
        >
          <b-input rounded v-model="settings.doorLockPath" />
        </tooltip-field>
        <tooltip-field
          label="Chemin vers le platformio"
          tooltip="Chemin (sur le serveur) vers l'executable de platformio."
        >
          <b-input rounded v-model="settings.platformioPath" />
        </tooltip-field>
      </div>
    </template>
  </form-modal>
</template>

</template>

<script>
import TooltipField from "./tooltipField.vue";
export default {
  name: "SettingsForm",
  props: ["settings"],

  data() {
    return {
      schema: {
        fields: [
          {
            type: "field-slot",
            name: "mail",
            label: "mail",
          },
          {
            type: "field-slot",
            name: "door",
            label: "door",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$axios
        .$post("/settings", this.settings)
        .then(() => {
          this.$emit("submit");
        })
        .catch((e) => this.$refs.form.validation(e));
    },
  },
  components: { TooltipField },
  mounted() {
    console.log("settings", this.settings);
  },
};
</script>

<style >
.box {
  margin-top: 1em;
}
.help-button.is-small {
  border-radius: 50%;
  padding: 12px;
}
</style>
