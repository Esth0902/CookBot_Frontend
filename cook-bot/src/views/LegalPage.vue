<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>Informations Légales</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="segment" @ionChange="segmentChanged">
          <ion-segment-button value="privacy">
            <ion-label>Confidentialité</ion-label>
          </ion-segment-button>
          <ion-segment-button value="mentions">
            <ion-label>Mentions Légales</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="segment === 'privacy'" class="legal-text">
        <h2>Politique de Confidentialité (RGPD)</h2>
        <p class="date-update">Dernière mise à jour : {{ new Date().toLocaleDateString() }}</p>

        <h3>1. Données collectées</h3>
        <p>Dans le cadre de l'utilisation de l'application, nous collectons les données suivantes :</p>
        <ul>
          <li><strong>Compte :</strong> Nom d'utilisateur et mot de passe chiffré.</li>
          <li><strong>Préférences :</strong> Régimes alimentaires, allergies, nombre de personnes.</li>
          <li><strong>Utilisation :</strong> Recettes générées et sauvegardées en favoris.</li>
          <li><strong>Technique :</strong> Jeton de connexion (Token) stocké localement.</li>
          <li><strong>Métriques :</strong> Volume d'utilisation du service par compte.</li>
        </ul>

        <h3>2. Utilisation des données</h3>
        <p>Ces données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Gérer votre authentification et sécuriser votre compte.</li>
          <li>Personnaliser les recettes générées par l'intelligence artificielle.</li>
          <li>Vérifier votre statut d'abonnement (Free/Premium).</li>
          <li>Surveiller l'usage du service (métriques) afin de gérer les coûts liés à l'IA et détecter d'éventuels abus ou usages anormaux.</li>
        </ul>
        <p>Ces traitements sont fondés sur l’exécution du contrat liant l’utilisateur à Cookbot et sur l’intérêt légitime au bon fonctionnement,
          à la sécurité et la viabilité économique du service.</p>

        <h3>3. Partage des données</h3>
        <p>Vos données personnelles ne sont <strong>jamais vendues</strong> à des tiers publicitaires.</p>
        <p>Elles peuvent être transmises de manière sécurisée à nos sous-traitants techniques uniquement pour le fonctionnement du service :</p>
        <ul>
          <li><strong>Hébergement :</strong> Render (USA/Europe).</li>
          <li><strong>Intelligence Artificielle :</strong> Le contenu de vos demandes (ingrédients, préférences) est envoyé à OpenRouter uniquement pour générer les recettes.</li>
        </ul>
        <p>Certains traitements peuvent impliquer un transfert de données hors de l’Union européenne. Dans ce cas, Cookbot veille à ce que des garanties appropriées soient mises en place conformément au RGPD.</p>

        <h3>4. Vos droits</h3>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez supprimer définitivement votre compte et toutes les données associées directement depuis la page "Settings" de l'application.</p>
        <p>Toute demande relative aux données personnelles peut être adressée à : contact@cookbot.com</p>
        <h3>5. Cookies et Stockage Local</h3>
        <p>
          Nous n'utilisons <strong>aucun cookie publicitaire ou de traçage tiers</strong>.
        </p>
        <p>
          Cependant, nous utilisons la technologie du "LocalStorage" sur votre appareil pour stocker votre <strong>jeton de session (Token)</strong>. Ce stockage est techniquement indispensable pour vous permettre de rester connecté et de sécuriser vos échanges avec le serveur.
        </p>
        <p>
          Conformément aux recommandations de la CNIL et au RGPD, ces traceurs étant "strictement nécessaires à la fourniture du service", ils ne nécessitent pas de consentement préalable.
        </p>
        <h3>6. Durée de conservation</h3>
        <p>Les données personnelles sont conservées tant que le compte utilisateur est actif.
          En cas de suppression du compte, l’ensemble des données associées est supprimé.</p>
        <p>Les métriques techniques peuvent être conservées sous forme agrégée ou anonymisée à des fins de statistiques et de suivi global des coûts,
        sans possibilité d’identifier un utilisateur individuel.</p>
        
        <p> Responsable du traitement des données : </p>
        <ul>
          <li>Cookbot - Team Cookbot</li>
          <li>Contact : contact@cookbot.com</li>
        </ul>
      </div>

      <div v-if="segment === 'mentions'" class="legal-text">
        <h2>Mentions Légales</h2>

        <h3>Éditeur</h3>
        <p>
          <strong>Team Cookbot - Projet étudiant</strong><br>
          Adresse : Rue de la Limite 6, 1300 Wavre, Belgique<br>
          Contact : contact@cookbot.com
        </p>

        <h3>Hébergement</h3>
        <p>
          L'application et la base de données sont hébergées par :<br>
          <strong>Render Services Inc.</strong><br>
          San Francisco, California, USA.<br>
          Données hébergées sur la région Frankfurt/Europe .
        </p>

        <h3>Propriété Intellectuelle</h3>
        <p>
          L'ensemble du design, des graphismes, du logo et du code source de l'application Cookbot est la propriété exclusive de la Team Cookbot.
          Toute reproduction partielle ou totale sans autorisation est interdite.
        </p>

        <h3>Limitation de responsabilité</h3>
        <p>
          Les recettes sont générées par une intelligence artificielle. Bien que nous visions la meilleure qualité possible, Cookbot ne peut être tenu responsable en cas d'imprécision dans les instructions ou les dosages. Il appartient à l'utilisateur de faire preuve de discernement lors de la réalisation des recettes (notamment concernant les allergies graves).
        </p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/vue';
import { ref } from 'vue';

const segment = ref('privacy');

function segmentChanged(e: CustomEvent) {
  segment.value = e.detail.value;
}
</script>

<style scoped>
.legal-text {
  color: var(--ion-text-color);
  line-height: 1.6;
  padding-bottom: 40px;
}

.date-update {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-bottom: 20px;
  font-style: italic;
}

.legal-text h2 {
  margin-top: 10px;
  color: var(--ion-color-primary);
  font-weight: 700;
}

.legal-text h3 {
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ion-color-light);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 5px;
}

.legal-text p {
  margin-bottom: 10px;
  text-align: justify;
}

ul {
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 6px;
}
</style>