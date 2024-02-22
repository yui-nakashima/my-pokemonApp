<!-- localhost:3000/trainer -->
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
    trainersData.value = response;
};



// 画面遷移
const movePage = (path) => {
    router.push(path);
}

onMounted(() => {
    getTrainers();
})

</script>

<template>
    <div>
        <h1>つづきからはじめる</h1>
        <!-- <GamifyList v-for="trainer in getTrainers()" :key="trainer.ID"> -->
        <GamifyList>
            <GamifyItem v-for="trainer in trainersData" :key="trainer.ID">
                <NuxtLink :to="`trainer/${trainer.Key.slice(0, -5)}`">{{ trainer.Key.slice(0, -5) }}</NuxtLink>
            </GamifyItem>
        </GamifyList>
        <GamifyButton @click="movePage('/new')">あたらしくはじめる</GamifyButton><br><br>
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
