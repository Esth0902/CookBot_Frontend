<template>
  <section class="pricing-section">
    <h1 class="pricing-title">Avec Premium, c’est moins de prise de tête et beaucoup plus de goût.</h1>

    <p v-if="error" class="pricing-error"> {{ error }}</p>
    <p v-if="success" class="pricing-success"> {{ success }}</p>

    <div class="pricing-grid">

      <!-- FREE PLAN -->
      <div class="pricing-card">
        <h2 class="plan-title">Gratuit</h2>
        <p class="plan-price">0€<span>/mois</span></p>

        <ul class="plan-features">
          <li>Une nouvelle recette par jour</li>
          <li>Gestion de vos favoris</li>
          <li>Liste de courses disponible</li>
          <li>Fonctionnalités limitées</li>
        </ul>

      </div>

      <div class="pricing-card premium">
        <h2 class="plan-title">Premium</h2>
        <p class="plan-price">5,99€<span>/mois</span></p>

        <ul class="plan-features">
          <li>Recettes illimitées</li>
          <li>Génération de recettes depuis une photo de ton frigo</li>
          <li>Suggestions de saison</li>
          <li>Astuces du chef</li>
          <li>Personnalisation complète</li>
          <li>Accès aux favoris</li>
          <li>Accès à la liste de courses</li>
        </ul>

        <button class="plan-button premium-btn"
        @click="onStartTrial"
        :disabled="loading">
          <span v-if="!loading">Essayer gratuitement durant 5 jours</span>
          <span v-else>Activation de l'essai</span>
        </button>
      </div>

    </div>
  </section>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAuthenticated, startTrial } from '@/services/authApi';
import { useUserSettings } from '@/composables/useUserSettings';

const router = useRouter();
const emit = defineEmits(['trialActivated']);
const { checkPremiumStatus } = useUserSettings();
const loading = ref(false);
const error = ref('');
const success = ref('');

const onStartTrial = async () => {
  error.value = '';
  success.value = '';


  if (!isAuthenticated()) {
    router.push('/register');
    return;
  }

  loading.value = true;
  try {
    const msg = await startTrial();
    success.value = msg || 'Essai Premium activé 🎉';
    checkPremiumStatus();
    emit('trialActivated');
    setTimeout(() => {
      router.push('/tabs/home');
    }, 1500);
  } catch (e: any) {
    console.error(e);
    error.value = e.message || 'Erreur lors de l’activation de l’essai';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.pricing-section {
  padding: 40px 20px;
  text-align: center;
}

.pricing-title {
  font-size: 2rem;
  margin-bottom: 30px;
  color: var(--ion-color-light);
}

.pricing-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.pricing-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  transition: transform 0.3s ease;
  border: 1px solid var(--ion-color-primary);

}

.pricing-card:hover {
  transform: translateY(-6px);
}

.plan-title {
  color: var(--ion-color-light);
  font-size: 1.4rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.plan-price {
  color: var(--ion-color-primary);
  font-size: 2rem;
  font-weight: 700;
}
.plan-price span {
  font-size: 1rem;
  opacity: 0.8;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: var(--ion-color-light);
}

.plan-features li {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.plan-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: var(--ion-color-primary);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
}

.plan-button:hover {
  opacity: 0.9;
}

.premium-btn {
  background: var(--ion-color-secondary);
}

.premium {
  border: 1px solid var(--ion-color-secondary);
}

.pricing-error {
  color: var(--ion-color-secondary);
  margin-bottom: 10px;
  font-weight: 500;
}

.pricing-success {
  color: var(--ion-color-primary);
  margin-bottom: 10px;
  font-weight: 500;
}


</style>
