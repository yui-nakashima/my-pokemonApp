<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const safeTrainerName = computed(() => trimAvoidCharacters(trainerName.value));
const { dialog, onOpen, onClose } = useDialog();

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

// 画面遷移
const movePage = (path) => {
    router.push(path);
}

</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <div>
      <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
      <form @submit.prevent>
        <div>
          <label for="name">なまえ</label>
          <span id="name-description">とくていの　もじは　とりのぞかれるぞ！</span>
          <input id="name" v-model="trainerName" />
        </div>
        <GamifyButton type="button" @click="onOpen(true)">けってい</GamifyButton>

        <GamifyDialog v-if="dialog" id="" title="かくにん" :description="`ふむ・・・　きみは　${safeTrainerName}　と　いうんだな！`"
          @close="onClose">
          <GamifyList :border="false" :direction="horizon">
            <GamifyItem>
              <GamifyButton @click="onSubmit">はい</GamifyButton>
            </GamifyItem>
            <GamifyItem>
              <GamifyButton @click="onClose">いいえ</GamifyButton>
            </GamifyItem>
          </GamifyList>
        </GamifyDialog>
      </form>
    </div>
    <br>
    <GamifyButton @click="movePage('/trainer')">つづきからはじめる</GamifyButton><br><br>
    <GamifyButton @click="movePage('/')">さいしょにもどる</GamifyButton>

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
