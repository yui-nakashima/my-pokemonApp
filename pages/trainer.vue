<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainersData = ref("");

const getTrainers = async () => {
  const response = await $fetch("/api/trainers", {
    baseURL: config.public.backendOrigin,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => e);
  if (response instanceof Error) return;
  // router.push(`/trainer/${safeTrainerName.value}`);
  console.log(response[1].Key);

  trainersData.value = response;
};

const getTrainer = async () => {
  const response = await $fetch("/api/trainer/yui", {
    baseURL: config.public.backendOrigin,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => e);
  if (response instanceof Error) return;
  // router.push(`/trainer/${safeTrainerName.value}`);
  // console.log(response);

  trainersData.value = response;
};

onMounted(() => {
  getTrainers();
})

</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <!-- <GamifyList v-for="trainer in getTrainers()" :key="trainer.ID"> -->
    <GamifyButton @click="getTrainer">botan</GamifyButton>
    <GamifyList>
      <GamifyItem v-for="trainer in trainersData" :key="trainer.ID">
        <a href="http://localhost:3000/api/hello">{{ trainer.Key.slice(0, -5) }}</a>
        <!-- <NuxtLink to="/api/TRAINERNAME">{{ trainer.Key.slice(0, -5) }}</NuxtLink> -->
      </GamifyItem>
    </GamifyList>

  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form> :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item>label,
.item>span {
  display: block;
  margin-bottom: 0.25rem;
}

.item>span {
  font-size: 0.875rem;
}
</style>
