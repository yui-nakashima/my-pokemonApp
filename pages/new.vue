<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const safeTrainerName = computed(() => trimAvoidCharacters(trainerName.value));

// const onSubmit = async () => {
//   const response = await $fetch("/api/trainer", {
//     baseURL: config.public.backendOrigin,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: trainerName.value,
//     }),
//   }).catch((e) => console.log(e));
//   if (response instanceof Error) return;
//   router.push(`/trainer/${safeTrainerName.value}`);
// };
const onSubmit = async () => {
  const response = await $fetch("/api/trainer", {
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: safeTrainerName.value,
    }),
  }).catch((e) => e);
  if (response instanceof Error) return;
  router.push(`/trainer/${safeTrainerName.value}`);
};

</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    <form @submit.prevent>
      <div>
        <label for="name">なまえ</label>
        <span id="name-description">とくていの　もじは　とりのぞかれるぞ！</span>
        <input id="name" v-model="trainerName" @keydown.enter="onOpen(true)" />
      </div>
      <!-- <GamifyButton type="button" @click="onOpen(true)">けってい</GamifyButton> -->
      <!-- 一旦直接送信 -->
      <GamifyButton type="button" @click="onSubmit">けってい</GamifyButton>
    </form>

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
